import type { GameResources, Player } from "../app/context/GameContext";

type ApplyChallengeEffectsArgs = {
  effectsText: string;
  optionLabel?: string;
  challengeTitle?: string;
  selectedPlayerId?: string | null;
  protectedPlayerIds?: string[];
  d20?: number | null;

  players: Player[];
  groupPoints: number;
  infectionLevel: number;
  casualties: number;
  resources: GameResources;

  updatePlayerHP: (playerId: string, hp: number) => void;
  updatePlayerPoints: (playerId: string, delta: number) => void;
  updatePlayerAmmunition: (playerId: string, ammo: number) => void;

  setGroupPointsAbsolute: (points: number) => void;
  setResourceAbsolute: (resource: keyof GameResources, amount: number) => void;
  setCasualtiesAbsolute: (casualties: number) => void;
  setInfectionLevel: (level: number) => void;
};

const clamp = (val: number, min: number, max: number) =>
  Math.min(max, Math.max(min, val));

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const splitSegments = (effectsText: string) =>
  effectsText
    .split("|")
    .map((segment) => segment.trim())
    .filter(Boolean);

const parseSigned = (raw: string, fullText?: string) => {
  const numeric = Math.abs(Number(raw));

  if (raw.startsWith("-")) return -numeric;
  if (raw.startsWith("+")) return numeric;

  const text = (fullText ?? "").toLowerCase();

  if (
    text.includes("pierde") ||
    text.includes("pierden") ||
    text.includes("gasta") ||
    text.includes("gastan") ||
    text.includes("reduce") ||
    text.includes("reducen") ||
    text.includes("disminuye") ||
    text.includes("disminuyen")
  ) {
    return -numeric;
  }

  return numeric;
};

const getPlayerFromLabel = (players: Player[], optionLabel?: string) => {
  if (!optionLabel) return null;

  const normalized = optionLabel.toLowerCase();
  return (
    players.find((player) => normalized.includes(player.name.toLowerCase())) ?? null
  );
};

const getRandomAvailableResource = (
  resources: GameResources
): keyof GameResources | null => {
  const available = (Object.keys(resources) as (keyof GameResources)[]).filter(
    (key) => resources[key] > 0
  );

  if (available.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
};

export function applyChallengeEffects({
  effectsText,
  optionLabel,
  challengeTitle,
  selectedPlayerId,
  protectedPlayerIds = [],
  d20,

  players,
  groupPoints,
  infectionLevel,
  casualties,
  resources,

  updatePlayerHP,
  updatePlayerPoints,
  updatePlayerAmmunition,

  setGroupPointsAbsolute,
  setResourceAbsolute,
  setCasualtiesAbsolute,
  setInfectionLevel,
}: ApplyChallengeEffectsArgs) {
  const segments = splitSegments(effectsText);

  let nextGroupPoints = groupPoints;
  let nextInfection = infectionLevel;
  let nextCasualties = casualties;

  const nextResources: GameResources = {
    plasmaShield: resources.plasmaShield,
    sporeDetector: resources.sporeDetector,
    medicalKit: resources.medicalKit,
    ammunition: resources.ammunition,
  };

  const hpMap = new Map<string, number>();
  const ammoMap = new Map<string, number | undefined>();

  players.forEach((player) => {
    hpMap.set(player.id, player.hp);
    ammoMap.set(player.id, player.ammunition);
  });

  const selectedByLabel = getPlayerFromLabel(players, optionLabel);
  const selectedPlayer =
    players.find((player) => player.id === selectedPlayerId) ?? selectedByLabel ?? null;

  const applyHpToPlayer = (playerId: string, delta: number) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;

    const currentHp = hpMap.get(playerId) ?? player.hp;
    hpMap.set(playerId, clamp(currentHp + delta, 0, player.maxHp));
  };

  const applyAmmoToPlayer = (playerId: string, nextAmmo: number) => {
    ammoMap.set(playerId, Math.max(0, nextAmmo));
  };

  for (const segment of segments) {
    const text = segment.toLowerCase();

    if (!text || text.includes("sin cambios")) continue;

    // ===== PUNTOS GRUPALES =====
    const groupPointsMatch = segment.match(
      /([+-]?\d+)\s*(?:pts?|puntos?)\s*grupales?/i
    );
    if (groupPointsMatch) {
      nextGroupPoints += Number(groupPointsMatch[1]);
    }

    // ===== INFECCIÓN GLOBAL =====
    const infectionMatch = segment.match(
      /([+-]?\d+(?:\.\d+)?)\s*infecci[oó]n(?:\s*global)?/i
    );
    if (infectionMatch) {
      nextInfection += parseSigned(infectionMatch[1], segment);
    }

    // ===== BAJAS =====
    const casualtiesMatch = segment.match(/([+-]?\d+)\s*bajas?/i);
    if (casualtiesMatch) {
      nextCasualties += Number(casualtiesMatch[1]);
    }

    // ===== PUNTOS INDIVIDUALES PARA TODOS =====
    const allPointsMatch = segment.match(
      /([+-]?\d+)\s*(?:pts?|puntos?)\s*individual(?:es)?(?:\s*(?:cada jugador|para todos|a cada jugador))?/i
    );
    if (allPointsMatch && !players.some((p) => text.includes(p.name.toLowerCase()))) {
      const delta = Number(allPointsMatch[1]);
      players.forEach((player) => updatePlayerPoints(player.id, delta));
    }

    // ===== HP PARA TODOS =====
    const explicitAllHpMatch = segment.match(
      /(?:todos?|cada jugador)\s+(pierden|ganan)\s*([+-]?\d+)\s*hp/i
    );

    if (
      explicitAllHpMatch &&
      !players.some((p) => text.includes(p.name.toLowerCase()))
    ) {
      const delta = parseSigned(explicitAllHpMatch[2], explicitAllHpMatch[1]);
      players.forEach((player) => applyHpToPlayer(player.id, delta));
    }

    // ===== CADA JUGADOR PIERDE/GANA HP =====
    const eachPlayerHpMatch = segment.match(
      /cada jugador\s+(pierde|pierden|gana|ganan)\s*([+-]?\d+)\s*hp/i
    );
    if (eachPlayerHpMatch) {
      const delta = parseSigned(eachPlayerHpMatch[2], eachPlayerHpMatch[1]);
      players.forEach((player) => applyHpToPlayer(player.id, delta));
    }

    // ===== 3 PROTEGIDOS =====
    if (text.includes("3 protegidos") && protectedPlayerIds.length > 0) {
      // marcador lógico; la aplicación real sucede en "los demás" y "los que quedan afuera"
    }

    // ===== LOS QUE QUEDAN AFUERA =====
    if (text.includes("los que quedan afuera")) {
      const pointsMatch = segment.match(/([+-]?\d+)\s*(?:pts?|puntos?)/i);
      if (pointsMatch && protectedPlayerIds.length > 0) {
        const delta = Number(pointsMatch[1]);

        players
          .filter((player) => !protectedPlayerIds.includes(player.id))
          .forEach((player) => updatePlayerPoints(player.id, delta));
      }
    }

    // ===== LOS DEMÁS =====
    if (text.includes("los demás")) {
      const hpMatch = segment.match(/([+-]?\d+)\s*hp/i);
      const pointsMatch = segment.match(/([+-]?\d+)\s*(?:pts?|puntos?)/i);

      if (protectedPlayerIds.length > 0) {
        if (hpMatch) {
          const delta = Number(hpMatch[1]);
          players
            .filter((player) => !protectedPlayerIds.includes(player.id))
            .forEach((player) => applyHpToPlayer(player.id, delta));
        }

        if (pointsMatch) {
          const delta = Number(pointsMatch[1]);
          players
            .filter((player) => !protectedPlayerIds.includes(player.id))
            .forEach((player) => updatePlayerPoints(player.id, delta));
        }
      } else if (selectedPlayer) {
        if (hpMatch) {
          const delta = Number(hpMatch[1]);
          players
            .filter((player) => player.id !== selectedPlayer.id)
            .forEach((player) => applyHpToPlayer(player.id, delta));
        }

        if (pointsMatch) {
          const delta = Number(pointsMatch[1]);
          players
            .filter((player) => player.id !== selectedPlayer.id)
            .forEach((player) => updatePlayerPoints(player.id, delta));
        }
      }
    }

    // ===== 2 JUGADORES AL AZAR =====
    if (text.includes("2 jugadores al azar")) {
      const randomHpMatch = segment.match(/([+-]?\d+)\s*hp/i);
      if (randomHpMatch) {
        const delta = Number(randomHpMatch[1]);
        const shuffled = [...players].sort(() => Math.random() - 0.5).slice(0, 2);
        shuffled.forEach((player) => applyHpToPlayer(player.id, delta));
      }
    }

    // ===== CADA JUGADOR OBTIENE 1 RECURSO AL AZAR =====
    if (text.includes("cada jugador obtiene 1 recurso al azar")) {
      players.forEach((player) => {
        const randomIndex = Math.floor(Math.random() * 3);

        if (randomIndex === 0) {
          updatePlayerPoints(player.id, 1);
        } else if (randomIndex === 1 && player.ammunition !== undefined) {
          const currentAmmo = ammoMap.get(player.id) ?? player.ammunition;
          applyAmmoToPlayer(player.id, currentAmmo + 1);
        } else {
          const randomGroupResource = getRandomAvailableResource({
            plasmaShield: 1,
            sporeDetector: 1,
            medicalKit: 1,
            ammunition: 0,
          });

          if (randomGroupResource && randomGroupResource !== "ammunition") {
            nextResources[randomGroupResource] += 1;
          } else {
            updatePlayerPoints(player.id, 1);
          }
        }
      });
    }

    // ===== JUGADOR ESPECÍFICO POR NOMBRE =====
    players.forEach((player) => {
      const safeName = escapeRegExp(player.name);

      const hpMatch =
        segment.match(new RegExp(`${safeName}.*?(pierde|gana)?\\s*([+-]?\\d+)\\s*hp`, "i")) ||
        segment.match(new RegExp(`([+-]?\\d+)\\s*hp.*?${safeName}`, "i"));

      if (hpMatch) {
        const delta =
          hpMatch[2] !== undefined
            ? parseSigned(hpMatch[2], hpMatch[1] ?? segment)
            : Number(hpMatch[1]);

        applyHpToPlayer(player.id, delta);
      }

      const pointsMatch =
        segment.match(
          new RegExp(
            `${safeName}.*?(pierde|gana)?\\s*([+-]?\\d+)\\s*(?:pts?|puntos?)`,
            "i"
          )
        ) ||
        segment.match(
          new RegExp(`([+-]?\\d+)\\s*(?:pts?|puntos?).*?${safeName}`, "i")
        );

      if (pointsMatch) {
        const delta =
          pointsMatch[2] !== undefined
            ? parseSigned(pointsMatch[2], pointsMatch[1] ?? segment)
            : Number(pointsMatch[1]);

        updatePlayerPoints(player.id, delta);
      }

      const ammoExplicitMatch =
        segment.match(
          new RegExp(
            `${safeName}.*?(gasta|pierde|gana|recupera)?\\s*(toda la munici[oó]n|[+-]?\\d+\\s*municiones?)`,
            "i"
          )
        ) ||
        segment.match(
          new RegExp(`(toda la munici[oó]n|[+-]?\\d+\\s*municiones?).*?${safeName}`, "i")
        );

      if (ammoExplicitMatch && player.ammunition !== undefined) {
        const currentAmmo = ammoMap.get(player.id) ?? player.ammunition;
        const rawValue = ammoExplicitMatch[2] ?? ammoExplicitMatch[1] ?? "";
        const verb = ammoExplicitMatch[1] ?? segment;

        if (/toda la munici[oó]n/i.test(rawValue)) {
          applyAmmoToPlayer(player.id, 0);
        } else {
          const numericMatch = rawValue.match(/([+-]?\d+)/);
          if (numericMatch) {
            const delta = parseSigned(numericMatch[1], verb);
            applyAmmoToPlayer(player.id, currentAmmo + delta);
          }
        }
      }
    });

    // ===== JUGADOR SELECCIONADO / VOLUNTARIO / ENVIADO =====
    if (
      selectedPlayer &&
      (text.includes("voluntario") ||
        text.includes("jugador enviado") ||
        text.includes("enviar a un jugador") ||
        text.includes("un jugador se ofrece"))
    ) {
      const hpMatch = segment.match(/([+-]?\d+)\s*hp/i);
      if (hpMatch) {
        const delta = Number(hpMatch[1]);
        applyHpToPlayer(selectedPlayer.id, delta);
      }

      const pointsMatch = segment.match(/([+-]?\d+)\s*(?:pts?|puntos?)/i);
      if (pointsMatch) {
        const delta = Number(pointsMatch[1]);
        updatePlayerPoints(selectedPlayer.id, delta);
      }

      const ammoMatch = segment.match(/([+-]?\d+)\s*municiones?/i);
      if (ammoMatch && selectedPlayer.ammunition !== undefined) {
        const currentAmmo = ammoMap.get(selectedPlayer.id) ?? selectedPlayer.ammunition;
        applyAmmoToPlayer(selectedPlayer.id, currentAmmo + Number(ammoMatch[1]));
      }
    }

    // ===== MUNICIÓN PROPIA =====
    if (text.includes("municiones propias") && selectedPlayer?.ammunition !== undefined) {
      const currentAmmo = ammoMap.get(selectedPlayer.id) ?? selectedPlayer.ammunition;
      const ammoMatch = segment.match(/([+-]?\d+)\s*municiones?/i);

      if (ammoMatch) {
        const delta = parseSigned(ammoMatch[1], segment);
        applyAmmoToPlayer(selectedPlayer.id, currentAmmo + delta);
      }
    }

    // ===== RECURSOS GRUPALES =====
    if (text.includes("pierden detector") || text.includes("pierde detector")) {
      nextResources.sporeDetector = Math.max(0, nextResources.sporeDetector - 1);
    }

    if (text.includes("obtienen 1 kit médico") || text.includes("gana 1 kit médico")) {
      nextResources.medicalKit += 1;
    }

    if (text.includes("gasta 1 kit médico") || text.includes("pierden 1 kit médico")) {
      nextResources.medicalKit = Math.max(0, nextResources.medicalKit - 1);
    }

    if (
      text.includes("pierden escudo grupal") ||
      text.includes("pierde escudo grupal")
    ) {
      nextResources.plasmaShield = Math.max(0, nextResources.plasmaShield - 1);
    }

    if (
      text.includes("obtiene escudo de plasma") ||
      text.includes("ganan escudo de plasma")
    ) {
      nextResources.plasmaShield += 1;
    }

    // ===== RECURSO AL AZAR =====
    if (text.includes("recurso al azar")) {
      const randomResource = getRandomAvailableResource(nextResources);
      if (randomResource) {
        nextResources[randomResource] = Math.max(0, nextResources[randomResource] - 1);
      }
    }

    // ===== MUNICIÓN GRUPAL =====
    if (
      text.includes("municiones") &&
      !text.includes("propias") &&
      !players.some((p) => text.includes(p.name.toLowerCase()))
    ) {
      const ammoMatch = segment.match(/([+-]?\d+)\s*municiones?/i);
      if (ammoMatch) {
        nextResources.ammunition = Math.max(
          0,
          nextResources.ammunition + parseSigned(ammoMatch[1], segment)
        );
      }
    }
  }

  // ===== D20 ESPECIAL =====
  if (d20 !== null && d20 !== undefined) {
    if (challengeTitle?.toLowerCase().includes("puente inestable")) {
      const keira = players.find((player) =>
        player.name.toLowerCase().includes("keira")
      );
      if (keira && d20 % 2 !== 0) {
        applyHpToPlayer(keira.id, -5);
      }
    }

    if (challengeTitle?.toLowerCase().includes("cámara sellada")) {
      if (selectedPlayer && d20 > 10) {
        nextResources.plasmaShield += 1;
      }
    }
  }

  // ===== COMMIT FINAL =====
  players.forEach((player) => {
    const nextHp = hpMap.get(player.id);
    if (typeof nextHp === "number" && nextHp !== player.hp) {
      updatePlayerHP(player.id, nextHp);
    }

    const nextAmmo = ammoMap.get(player.id);
    if (
      typeof nextAmmo === "number" &&
      typeof player.ammunition === "number" &&
      nextAmmo !== player.ammunition
    ) {
      updatePlayerAmmunition(player.id, nextAmmo);
    }
  });

  setGroupPointsAbsolute(nextGroupPoints);
  setInfectionLevel(Math.max(0, nextInfection));
  setCasualtiesAbsolute(Math.max(0, nextCasualties));

  setResourceAbsolute("plasmaShield", nextResources.plasmaShield);
  setResourceAbsolute("sporeDetector", nextResources.sporeDetector);
  setResourceAbsolute("medicalKit", nextResources.medicalKit);
  setResourceAbsolute("ammunition", nextResources.ammunition);
}