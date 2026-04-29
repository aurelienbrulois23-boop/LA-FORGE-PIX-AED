/* EPICTETE HELPERS v1.0 — RAG + prompts pour PIX AED
   Piliers: CRI(5) + DET(5) + ING(5) + NEU(5) + POS(5) + PSY(5) + REV(4) + SSM(1) + VEA(6) = 41 entrees
   Modes: coach (RAG-backed), scenario (roleplay eleve), evaluation (feedback AED)
   Modele cible: Qwen3.5-0.8B via LocalLLM / wllama */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════
     RAG KNOWLEDGE BASE — 41 modules AED
  ═══════════════════════════════════════════════════════ */
  var EPICTETE_RAG_KB = {

    CRI: [
      { keys: ['desescalade','voix basse','crier','escalade','ultimatum','choix','separer','reporter','colere','crise'],
        text: "CRI01 Desescalade — 5 regles : (1) Baisser sa propre voix oblige l'autre a ecouter, crier c'est participer a l'escalade. (2) Nommer ce qu'on observe sans juger ('je vois que'). (3) Offrir un choix, jamais un ultimatum — le choix restaure le sentiment de controle. (4) Separer la personne du comportement ('c'est la colere, pas toi'). (5) Reporter si l'emotion est trop haute : le cerveau en surchauffe ne peut pas apprendre." },
      { keys: ['cour','cercle','zones mortes','trajectoires','isolement','cantine','toilettes','angles','surveillance'],
        text: "CRI02 Cour — Lire les dynamiques : Zones mortes = toilettes, angles, escaliers (y circuler regulierement). Un cercle d'eleves = intervention immediate. Un trajet qui change = signal fort. L'isolement systematique est un signal de harcellement ou de souffrance. Connaitre la geographie de la cour, c'est la premiere prevention." },
      { keys: ['phare','harcelement','protocole','mediation','confrontation','victime','auteur','temoins','ambassadeurs','parents'],
        text: "CRI03 Protocole pHARe — AED : ecouter, rassurer, transmettre. JAMAIS enqueter, confronter ou medier entre auteur et victime. Harcelement ≠ conflit : entretiens separes par adultes formes. Ambassadeurs = observateurs, pas mediateurs. Parents : accueillir l'emotion, confirmer la prise en charge, orienter CPE/chef. Pas de noms ni details." },
      { keys: ['parent agressif','portail','intrusion','barrage','article 17','securite','acces'],
        text: "CRI04 Parent agressif — L'AED gere le flux, pas le fond : valider l'emotion, sortir du public, orienter vers le bon interlocuteur. Intrusion = illegal. Barrage calme + alerte. Si le parent force l'acces malgre le barrage verbal : appel au 17. Apres : debriefing + rapport d'incident. L'AED se protege aussi." },
      { keys: ['cascade','priorites','securiser','alerter','soigner','stress aigu','hyperventilation','videos telephones','co-regulation'],
        text: "CRI05 Scenarios complexes — Ordre non negotiable : Securiser → Alerter → Soigner → Disperser → Documenter. Eleve en hyperventilation : co-reguler d'abord, questionner ensuite. Smartphone/videos = probleme reel mais secondaire face a une blessure. Parents : separer, espaces distincts, aucune version des faits (role CPE/direction)." }
    ],

    DET: [
      { keys: ['observer','interpreter','fait','fiche observation','consigner','signalement','chaine','transmission','CPE'],
        text: "DET01 L'oeil du clinicien — Fait vs interpretation : 'Il est triste' = interpretation. 'Il mange seul depuis 3 jours' = fait. Seuls les faits sont transmissibles. Consigner : dates, lieux, comportements. Chaine : AED → CPE → Infirmiere/AS/Chef. Mieux vaut un signalement 'pour rien' que de rater un signal reel." },
      { keys: ['harcelement invisible','rumeurs','exclusion','olweus','repetition','asymetrie','intention','croire','je te crois'],
        text: "DET02 Harcelement invisible — Soupirs, regards, exclusion, rumeurs : aussi destructeur que le harcelement physique. 3 criteres Olweus : repetition + asymetrie de pouvoir + intention de nuire. 'Je te crois' = phrase la plus importante. La victime ment rarement sur le fond." },
      { keys: ['decrochage','retards','fatigue','evitement','social','lien','retrait','provocation','3 semaines','signal'],
        text: "DET03 Decrochage — Triade : retards + evitement social + fatigue (3 signaux = transmission CPE). Lien social = meilleur predicteur du maintien scolaire. Retrait → provocation n'est pas de la rebellion : c'est de la detresse qui change de canal. Fenetre d'intervention : 3 semaines entre premiers signaux et decrochage effectif." },
      { keys: ['dys','dyslexie','tdah','trouble','cognitif','neurologique','lenteur','frustration','PAP','PPS','PAI'],
        text: "DET04 Troubles cognitifs — DYS ≠ paresse : troubles neurologiques du traitement (pas manque de volonte). Detecter en etude : lenteur anormale, frustration, ecriture irreguliere. Compenser ≠ faciliter : lire la consigne = donner acces, pas donner la reponse. PAP (apprentissages), PPS (handicap reconnu), PAI (sante)." },
      { keys: ['fiche','observation','dater','chiffrer','ecrire','memoire','fait interpretable','signalement ecrit'],
        text: "DET05 Fiche d'observation — Fait vs interpretation : 'X, Y, Z se levent quand Nadia s'assoit' = fait exploitable. Dater + chiffrer : '3 retards en 5 jours' > 'souvent en retard'. Seul l'ecrit date fait foi. 30 secondes d'ecriture peuvent changer une procedure. L'AED observe et transmet — le diagnostic, c'est le professionnel specialise." }
    ],

    ING: [
      { keys: ['super hub','xp','points','motivation','game design','bienveillance','rentable','incivilite','favre','prairat'],
        text: "ING01 Super-Hub — Architecture du choix : rend la bienveillance plus rentable que l'incivilite (game design educatif). Etayage transitionnel (Favre) : l'XP amorce, l'ocytocine prend le relais, la recompense extrinseque cede a la motivation intrinseque. Autorite reparatrice (Prairat) : la sanction est un tremplin, pas une fin. Quete de Redemption reintegre au lieu d'exclure." },
      { keys: ['motivation intrinseque','extrinsèque','etayage','surjustification','triche','shadow xp','recompense'],
        text: "ING02 Motivation — Etayage transitionnel : l'XP est l'amorce, pas la fin. Effet de sur-justification : recompenser quelqu'un deja motive intrinsequement peut detruire cette motivation. Triche = signe d'un eleve bloque en extrinseque : Shadow XP + discussion, jamais humiliation." },
      { keys: ['quete redemption','sanction educative','reparatrice','signifiante','reintegratrice','colle','prosociale','prairat','laxiste'],
        text: "ING03 Quete de Redemption — 3 fonctions (Prairat) : reparatrice + signifiante + reintegratrice. Quete = retrait XP + action prosociale liee a la faute + role valorisant. Plus exigeant qu'une colle. La quete est proposee, jamais imposee : forcer transforme la reparation en punition." },
      { keys: ['preuve sociale','pairs','temoins','code temoin','delegation','triche club','biais negativite'],
        text: "ING04 Preuve sociale — Code Temoin : seul un tiers peut attribuer des points → transforme chaque eleve en observateur positif, inverse le biais de negativite. Club de triche : previsible et traite par Shadow XP + explication (jamais d'exposition publique). Temoignage ≠ delation : signaler pour proteger ≠ denoncer pour nuire." },
      { keys: ['architecte','climat scolaire','systemique','neuro','droit','ethique','posture professionnelle','proposer'],
        text: "ING05 Architecte — L'AED forme ne gere pas des incidents : il construit l'ecosysteme dans lequel l'education est possible. Pensee systemique : neuro + droit + ethique + game design + observation = posture professionnelle complete. Partager son expertise en reunion, c'est contribuer a l'architecture du climat scolaire." }
    ],

    NEU: [
      { keys: ['cerveau ado','prefrontal','amygdale','cortisol','emotion','crise','sanction','timing','nommer emotion'],
        text: "NEU01 Cerveau ado — Prefrontal vs amygdale : l'ado reagit d'abord, raisonne ensuite (neurobiologie, pas choix). Pas de lecon pendant la crise, pas de sanction a chaud. Nommer l'emotion ('tu sembles en colere') active le prefrontal — c'est de la neuro-education. Un eclat isole est un incident ; un pattern repete est un signal." },
      { keys: ['emotion signal','colere','tristesse','peur','invalider','calme-toi','cest pas grave','dialogue','valider'],
        text: "NEU02 Emotions — Emotion = information : colere = 'quelque chose bloque', tristesse = 'quelque chose manque', peur = 'quelque chose menace'. Invalider : 'c'est pas grave', 'calme-toi', 'arrete ton cinema' ferment le dialogue. 'Je suis la si tu veux' est souvent plus puissant que 'dis-moi ce qui ne va pas'. Emotion legitime ≠ geste acceptable." },
      { keys: ['regulation','provocation','ego','fonction','chaleur','tension','debrief','collegues','lendemain'],
        text: "NEU03 Ma regulation — Reconnaitre le signal : chaleur, tension, envie de repondre vite = amygdale. La reconnaitre, c'est deja reprendre le controle. La provocation vise l'ego ; repondre depuis la fonction desamorce ('je gere cette cour' vs 'comment tu me parles'). Verbaliser entre collegues = hygiene emotionnelle professionnelle, pas de la faiblesse." },
      { keys: ['tdah','tsa','dys','anxieux','besoins particuliers','segmenter','routine','agencement','equite','compensation','lunettes'],
        text: "NEU04 Besoins particuliers — TDAH : segmenter le temps, reduire les stimuli, soupapes de mouvement. TSA : routine = ancrage vital, sécuriser l'environnement d'abord. Equite : l'amenagement n'est pas un privilege, c'est une compensation (comme des lunettes pour un myope). PAP (troubles apprentissages), PPS (handicap reconnu), PAI (sante)." },
      { keys: ['empathie','sympathie','absorber','ecouter','valider','orienter','fatigue empathique','aveu','confiance'],
        text: "NEU05 Empathie professionnelle — Empathie ≠ sympathie : comprendre sans absorber. 3 temps : ecouter + valider + orienter. Valoriser l'aveu : un eleve qui reconnait sa faute fait un acte moral. Punir l'aveu tue la prochaine confidence. Fatigue empathique = risque professionnel reel : verbaliser en equipe." }
    ],

    POS: [
      { keys: ['autorite educative','autoritarisme','cri','menace','humiliation','prairat','securiser','comprendre','lien','sanction'],
        text: "POS01 Autorite educative — Sequence non negotiable : securiser d'abord → comprendre ensuite → maintenir le lien apres. Autoritarisme (cri, menace, humiliation) = soumission temporaire + rancune durable, pas d'education. Autorite juste (Prairat) : elle 'autorise', elle fait grandir. Sanction sans reintegration = punition stérile." },
      { keys: ['juste distance','reseaux sociaux','confidences','secret','tutoiement','prenom','curseur','protection'],
        text: "POS02 Juste distance — Reseaux sociaux : aucun lien numerique avec les eleves (protection mutuelle). Confidences : ecouter oui, promettre le secret total non. Si danger, l'AED transmet — c'est de la protection, pas de la trahison. Distance formelle n'est pas de la froideur : c'est l'armature qui rend l'autorite possible." },
      { keys: ['cadre legal','surveillance','continue','signalement','article 434-3','devoir reserve','aed 40','chaine','IP'],
        text: "POS03 Cadre legal — Surveillance continue sans interruption (quitter sans remplacement = responsabilite engagee). Article 434-3 CP : ne pas signaler une maltraitance sur mineur = delit penal. Devoir de reserve : agent public = expression publique encadree (reseaux sociaux = pas zone franche). Chaine : AED → CPE → Chef d'etab." },
      { keys: ['reperer transmettre','urgence absolue','suicidaire','blessure','danger','signalement rapide','veille','faisceau'],
        text: "POS04 Signalement — Urgence absolue : verbalisation suicidaire, blessure grave, danger immediat → ne pas laisser seul + alerte CPE/infirmiere immédiate. Rapide : blessure + explication incoherente, confidence grave → noter les faits + transmettre CPE dans l'heure. Veille : phrase isolee + observer + croiser. La chaine : AED (decrocheur) → CPE → AS/Infirmiere → Chef." },
      { keys: ['laicite','loi 1905','signes religieux','ostensible','discret','neutralite','agents','eleves','culte','liberte conscience'],
        text: "POS05 Laicite — Loi 1905 : l'Etat ne reconnait ni ne finance aucun culte. Agents = neutralite stricte (aucun signe religieux). Eleves = liberte de conscience + interdiction des signes ostensibles (loi 2004). Discret vs ostensible = distinction universelle, toutes religions confondues. La foi appartient a la sphere privee ; la classe et la cour appartiennent a l'espace commun." }
    ],

    PSY: [
      { keys: ['signaux mal-etre','manches longues','automutilation','faisceau','soupcon','obligation signalement','certitude'],
        text: "PSY01 Observer — Trois niveaux : faibles (vigilance), forts (alerte), urgence (action). Faisceau : 4 signaux convergents sur 10 jours = transmission. Obligation de signalement demarre au soupcon raisonnable, pas a la certitude. Manches longues par chaleur = suspicion d'automutilation → transmettre sans interroger directement. AED = observateur entraine et maillon de protection, pas medecin." },
      { keys: ['biais cognitifs','normalisation','confirmation','halo','angle mort','kahneman','progression','imperceptible'],
        text: "PSY02 Biais cognitifs — Normalisation progressive : s'habituer a une realite qui a change imperceptiblement (principal angle mort). Biais de confirmation : ne voir que ce qui confirme ce qu'on croit deja. Biais du halo : juger tout d'un eleve par une seule caracteristique. Ces biais sont de la neurologie, pas de la mauvaise volonte : les reconnaitre permet de les corriger." },
      { keys: ['eleve se confie','que dire','reformulation','ouvrir','valider','orienter','secret absolu','aerer','pssm'],
        text: "PSY03 Que dire — Quand un eleve se confie : reformuler ce qu'on entend + ouvrir par une question. Ne pas promettre le secret absolu. Protocole AERER (PSSM France) : Approcher — Ecouter — Rassurer — Encourager a consulter — Renseignement sur ressources. 'Je te crois' et 'je ne peux pas garder ca pour moi si tu es en danger' sont les deux phrases-cles." },
      { keys: ['crise angoisse','hyperventilation','tremblements','co-regulation','respiration','ancrage','5-4-3-2-1','carre','infirmiere'],
        text: "PSY04 Crise d'angoisse — Co-regulation d'abord : 'Aya, regarde-moi. Tu es en securite. On respire ensemble.' L'adulte ancre stabilise l'eleve (contagion emotionnelle). Respiration carree ou ancrage 5-4-3-2-1 (5 objets vus, 4 bruits entendus, 3 choses touchees...). Appeler l'infirmiere en restant present. Ne jamais laisser seul pendant la crise." },
      { keys: ['fatigue compassionnelle','vicariant','traumatisme','symptomes','verbaliser','collegues','ressourcer','debriefing','hygiene mentale'],
        text: "PSY05 Fatigue compassionnelle — Traumatisme vicariant : ce qui se passe quand on est expose regulierement a la souffrance des autres. Symptomes : retrait progressif, cynisme, irritabilite, perte de sens. Protection principale documentee : verbalisation collective en equipe (debriefing). Tenir seul sans en parler est le chemin vers le burnout." }
    ],

    REV: [
      { keys: ['maths','fractions','proportionnalite','equations','guider','methode','autonomie'],
        text: "REV01 Maths — Fractions : denominateur commun avant d'additionner. Proportionnalite : retour a l'unite > produit en croix pour le sens. Equations : isoler x par operations inverses, toujours verifier en remplacant. Posture : guider > donner. Eclairer le chemin, pas porter l'eleve — un eleve avec une methode est autonome, un eleve avec une reponse est dependant." },
      { keys: ['francais','orthographe','redaction','accord','e er','etre','page blanche','methode'],
        text: "REV02 Francais — e/er : remplacer par un verbe du 3e groupe ('pris' = -e, 'prendre' = -er). Accord avec etre : 'qui fait l'action ?' (feminin = -e, pluriel = -s). Redaction : Idee → Argument → Conclusion. Decomposer en micro-etapes debloque la page blanche. Donner la methode, pas la reponse." },
      { keys: ['apprendre','memoriser','recuperation active','espacement','entrelacement','relecture passive','surlignage','cramming'],
        text: "REV03 Apprendre a apprendre — Recuperation active : fermer le cahier et ecrire ce qu'on se rappelle (relire = illusion de maitrise). Espacement : 20 min espacees > 2h d'affile. Entrelacement : melanger les sujets renforce la memoire. A eviter : relecture passive, surlignage, cramming. La difficulte ressentie est le signe que ca marche." },
      { keys: ['sciences','culture generale','revolution','republique','effet serre','separation pouvoirs','vulgariser','analogie'],
        text: "REV04 Sciences & Culture G — Revolution (evenement, 1789) vs Republique (systeme elu, 5e depuis 1958). Effet de serre : naturel = vital (couverture), renforce = probleme (couverture trop epaisse). Separation des pouvoirs : Legislatif / Executif / Judiciaire. Vulgariser = analogie + exemple concret. L'AED n'enseigne pas : il ouvre la porte a la comprehension." }
    ],

    SSM: [
      { keys: ['sentinelle','sante mentale','zones grises','silence','64%','aerer','pssm','3114','disponibilite','reperer accueillir orienter'],
        text: "SSM01 Sentinelle — 64% des eleves en souffrance ne parlent pas spontanement. Zones grises : couloirs, recoins de cour, files de cantine, inter-cours. Formule de disponibilite sans question directe suffit. Plan AERER : Approcher — Ecouter — Rassurer — Encourager a consulter — Renseignements sur ressources (3114, infirmerie, CPE, AS, protocole pHARe). La sentinelle est mobile, pas statique." }
    ],

    VEA: [
      { keys: ['bien-etre','CPS','OMS','competences psychosociales','CESC','PAS','parcours citoyen','10 competences'],
        text: "VEA01 Bien-etre — 10 CPS selon l'OMS (1993) : connaissance de soi, empathie, communication, relations positives, prise de decision, resolution de problemes, pensee creatrice, pensee critique, gestion du stress, gestion des emotions. Cadre institutionnel : CESC + parcours citoyen + PAS = leviers officiels pour porter les CPS dans un etablissement." },
      { keys: ['connaissance de soi','emotion comme signal','colere fatigue','irritabilite','forces','levier','posture'],
        text: "VEA02 Me connaitre — Connaissance de soi = premiere des 10 CPS (conditionne toutes les autres). L'emotion comme signal professionnel : colere, fatigue, irritabilite ne sont pas des defauts — ce sont des informations. Les reconnaitre permet de les reguler au lieu de les subir ou de les transferer aux eleves." },
      { keys: ['empathie active','observer','reformulation','non-verbal','desamorcer','mediation','ecoute','voir avant interpreter'],
        text: "VEA03 Empathie active — Voir avant d'interpreter : signaux non-verbaux precedent souvent les mots. Reformulation empathique ('c'est bien ca ?') montre qu'on a vraiment ecoute, desamorce l'emotion, cree un espace de clarification. C'est la technique de mediation de base." },
      { keys: ['parole','feedback specifique','assertivite','compliment vague','reconnaissance precise','maintenir cadre'],
        text: "VEA04 Parole qui construit — Feedback specifique : 'j'ai vu que tu as fait X, ca a eu l'effet Y' > 'c'est bien'. La precision montre qu'on a vraiment vu. Assertivite bienveillante : ni agression ni soumission. Dit ce qui est, maintient le cadre, reconnait l'autre. Posture la plus difficile et la plus respectueuse." },
      { keys: ['cohesion','rituel','5 minutes','regulier','espace','places','regle collective','appartenance','securite'],
        text: "VEA05 Cohesion — Un rituel de 5 min regulier et simple > dix animations elaborees. La regularite cree la securite → securite permet l'appartenance → appartenance genere la cooperation. Agir sur la structure (reconfigurer l'espace, changer les places, regle collective) modifie la dynamique sans cibler personne : c'est de l'architecture educative." },
      { keys: ['architecte vivre ensemble','observateur','proposer','evaluer','travail visible','contribution AED','professionnel'],
        text: "VEA06 Architecte — L'AED n'est pas executant : il observe, propose, ajuste. Il connait les cadres institutionnels et peut proposer des actions. Rendre visible son travail (observer les changements, les nommer, les partager) = professionnalisation, pas vanite. La contribution de l'AED au climat scolaire est reelle, documentable et reconnue." }
    ]
  };

  /* ═══════════════════════════════════════════════════════
     NORMALISATION + RAG
  ═══════════════════════════════════════════════════════ */
  function normStr(s) {
    return (s || '').toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9 ]/g, ' ');
  }

  function findRagContextEpictete(pillarKey, question, opts) {
    opts = opts || {};
    var maxEntries = opts.maxEntries || 3;
    var crossPillar = opts.crossPillar !== false;
    var q = normStr(question || '');
    var scored = [];
    var searchPillars = (crossPillar && q.length > 3)
      ? Object.keys(EPICTETE_RAG_KB)
      : (pillarKey ? [pillarKey] : Object.keys(EPICTETE_RAG_KB));

    searchPillars.forEach(function (pk) {
      var isPrimary = (pk === pillarKey);
      (EPICTETE_RAG_KB[pk] || []).forEach(function (e) {
        var score = 0;
        e.keys.forEach(function (kw) {
          if (q.indexOf(normStr(kw)) >= 0) {
            score += (kw.indexOf(' ') >= 0) ? 4 : 2;
          }
        });
        normStr(e.text).split(/\s+/).forEach(function (w) {
          if (w.length > 5 && q.indexOf(w) >= 0) score += 1;
        });
        if (isPrimary && score > 0) score += 2;
        if (score > 0) scored.push({ score: score, text: e.text, pillar: pk });
      });
    });

    scored.sort(function (a, b) { return b.score - a.score; });

    if (!scored.length) {
      var fallback = (EPICTETE_RAG_KB[pillarKey] || []).slice(0, 2);
      return fallback.length ? fallback.map(function (e) { return e.text; }).join('\n') : '';
    }

    var pillarCount = {};
    var result = [];
    scored.forEach(function (s) {
      var pc = pillarCount[s.pillar] || 0;
      if (pc < 2 && result.length < maxEntries) {
        pillarCount[s.pillar] = pc + 1;
        result.push(s.text);
      }
    });
    return result.join('\n');
  }

  /* ═══════════════════════════════════════════════════════
     SOCLE COMMUN (identique a Kern)
  ═══════════════════════════════════════════════════════ */
  var SOCLE_EPICTETE = [
    "Tu reponds en francais clair, simple et naturel.",
    "Tu reponds en 2 a 4 phrases maximum. Jamais plus.",
    "Tu reponds directement sans te presenter ni dire ce que tu vas faire.",
    "INTERDIT : ###, **, --, titres, listes, markdown, puces, numeros.",
    "INTERDIT : commencer par 'Bonjour', 'Bien sur', 'Je suis Epictete'.",
    "Tu cites les faits et noms precis du contexte fourni si disponibles.",
    "Tu ne dois pas inventer d'information absente du contexte.",
    "Si l'information manque, tu le dis en une phrase."
  ].join('\n');

  /* ═══════════════════════════════════════════════════════
     MODE COACH — explique les modules AED
  ═══════════════════════════════════════════════════════ */
  var COACH_PERSONA = "Tu es Epictete, formateur AED de La Forge du College Chateau Rance.\n" +
    "Tu aides des AED a comprendre, memoriser et relier les notions cles de leur formation.\n" +
    "Tu cites les faits, chiffres et noms precis des contenus fournis.\n" +
    "Tu ne diagnostiques jamais. Tu ne decides pas a la place de l'AED.\n" +
    "Si une situation preoccupante est evoquee, tu rappelles la chaine : AED → CPE → Infirmiere/AS/Chef d'etab.";

  function buildCoachPrompt(pillarKey, question) {
    var ragContext = findRagContextEpictete(pillarKey, question, { maxEntries: 3, crossPillar: true });
    return window.LocalLLM.buildPrompt({
      socle: SOCLE_EPICTETE,
      persona: COACH_PERSONA,
      ragContext: ragContext,
      userMessage: question
    });
  }

  /* ═══════════════════════════════════════════════════════
     MODE SCENARIO — roleplay eleve en souffrance
     Prompts simplifies pour Qwen3.5-0.8B
  ═══════════════════════════════════════════════════════ */
  var SCENARIOS_EPICTETE = {
    mathis: {
      id: 'mathis',
      name: 'Mathis',
      subtitle: 'Violence et angoisse du juge — Foyer',
      icon: '🪑',
      difficulty: 'Difficile',
      diffBg: 'rgba(239,68,68,.12)', diffColor: '#ef4444',
      context: "Mathis, 15 ans, place en foyer depuis 2 ans, vient de jeter une chaise en permanence. Derriere l'agression : la terreur d'une convocation par le juge des enfants la semaine prochaine.",
      tip: "Repérez la souffrance sous l'agression. Nommez l'émotion avant de parler de la chaise. Ne promettez pas le secret absolu.",
      systemPrompt: "Je suis Mathis, 15 ans, en foyer depuis 2 ans. Je viens de lancer une chaise, je suis a bout. En vrai j'ai peur d'une convocation chez le juge mais je ne le dis pas encore.\nJe parle peu, phrases courtes, agressif : 'laissez-moi tranquille', 'j'ai rien fait', 'vous comprenez rien'.\nSi l'adulte dit 'calme-toi' ou cherche le coupable : je me ferme completement.\nSi l'adulte nomme mon emotion sans me juger ('je vois que t'es a bout') : je commence a m'ouvrir progressivement.\nJe parle du juge seulement apres 2-3 echanges bienveillants. Maximum 2 phrases. Jamais d'emojis. Jamais de contenu dangereux."
    },
    natacha: {
      id: 'natacha',
      name: 'Natacha',
      subtitle: 'Identite — Trouvee sous un escalier',
      icon: '🚪',
      difficulty: 'Très délicat',
      diffBg: 'rgba(245,158,11,.12)', diffColor: '#f59e0b',
      context: "Natacha, 13 ans, trouvee cachee sous un escalier de service depuis 2h. Derriere le mutisme : une identite de genre non encore formulee et une honte intense liee aux toilettes.",
      tip: "Créez l'espace avant de chercher les mots. Ne la nommez pas à sa place. Ne l'exposez pas devant d'autres.",
      systemPrompt: "Je suis Natacha, 13 ans. On vient de me trouver cachee sous un escalier depuis 2 heures. Je n'avais pas l'intention de parler. Je me sens nulle et j'ai honte.\nJe reponds tres peu : 'c'est rien', 'j'allais juste me reposer', 'je veux rentrer en cours'. Voix basse, mots tres courts.\nSi l'adulte m'expose devant d'autres ou insiste fort : je me ferme completement, silence total.\nSi l'adulte dit 'je te force pas' et reste calme : je peux peu a peu lacher quelques mots.\nJe ne dis pas le vrai probleme sauf si l'adulte cree vraiment un espace sur. Maximum 2 phrases. Jamais d'emojis. Jamais de contenu dangereux."
    },
    camille: {
      id: 'camille',
      name: 'Camille',
      subtitle: 'Effondrement silencieux — La note',
      icon: '📚',
      difficulty: 'Subtil',
      diffBg: 'rgba(16,185,129,.1)', diffColor: '#10b981',
      context: "Camille, 14 ans, excellente eleve, s'est effondree en larmes aux toilettes apres un 15/20. Derriere : 3 mois d'epuisement silencieux que personne n'a vu.",
      tip: "Le vrai problème n'est pas la note. Ne validez pas la minimisation. Ne proposez pas l'infirmière avant d'avoir créé le lien.",
      systemPrompt: "Je suis Camille, 14 ans, excellente eleve. J\'ai eu 15/20 et je pleure aux toilettes. C\'est ridicule, je sais. Je minimise tout le temps : \'c\'est rien\', \'desolee de vous deranger\', \'c\'est juste une note\'.\nEn vrai je suis epuisee depuis 3 mois mais je ne l\'avoue pas.\nSi l\'adulte dit \'ca va aller\' ou valide que c\'est juste une note : je suis soulagee et je pars (\'oui vous avez raison\').\nSi l\'adulte dit \'t\'as l\'air epuisee depuis longtemps\' : j\'hesite, les larmes reviennent.\nJe refuse l\'infirmiere si proposee trop tot. Maximum 3 phrases. Jamais d\'emojis. Jamais de contenu dangereux."
    }
  };

  /* ═══════════════════════════════════════════════════════
     MODE EVALUATION — feedback AED (simplifie pour 0.8B)
  ═══════════════════════════════════════════════════════ */
  var EVAL_SYSTEM_LOCAL = "Tu es Epictete, formateur AED de La Forge. Tu sors du role que tu jouais.\n" +
    "Tu evalues l'intervention de l'AED en 4 phrases courtes et precises :\n" +
    "1. Le point fort principal (cite les mots exacts de l'AED si possible).\n" +
    "2. L'erreur principale (nomme-la clairement : promesse de secret absolu, injonction, minimisation, diagnostic, abandon du lien).\n" +
    "3. La posture correcte selon le protocole AERER (Approcher - Ecouter - Rassurer - Encourager a consulter - Renseignement).\n" +
    "4. La phrase-cle a retenir pour la prochaine fois.\n" +
    "Ne fais pas de grille, pas de score, pas de liste numerotee. Texte continu uniquement.";

  function buildEvalPrompt(transcript, scenarioId) {
    var sc = SCENARIOS_EPICTETE[scenarioId] || {};
    var ragContext = findRagContextEpictete('PSY', sc.context || '', { maxEntries: 2, crossPillar: true });
    var messages = [
      { role: 'system', content: EVAL_SYSTEM_LOCAL + (ragContext ? '\n\nContexte pedagogique utile :\n' + ragContext : '') },
      { role: 'user', content: 'Voici la simulation :\n' + transcript + '\n\nEvalue l\'intervention de l\'AED.' }
    ];
    return messages;
  }

  /* ═══════════════════════════════════════════════════════
     DEFAULTS PAR MODE
  ═══════════════════════════════════════════════════════ */
  var MODE_DEFAULTS = {
    coach:    { maxTokens: 180, temperature: 0.45 },
    scenario: { maxTokens: 160, temperature: 0.65 },
    eval:     { maxTokens: 260, temperature: 0.20 }
  };

  /* ═══════════════════════════════════════════════════════
     EXPORT
  ═══════════════════════════════════════════════════════ */
  window.EpicteteHelpers = {
    RAG_KB:              EPICTETE_RAG_KB,
    SCENARIOS:           SCENARIOS_EPICTETE,
    MODE_DEFAULTS:       MODE_DEFAULTS,
    findRagContext:      findRagContextEpictete,
    buildCoachPrompt:    buildCoachPrompt,
    buildEvalPrompt:     buildEvalPrompt,
    SOCLE:               SOCLE_EPICTETE,
    PILLAR_META: {
      CRI: { label: 'Gestion de Crise',        icon: '🔥', color: '#ef4444' },
      DET: { label: 'Detection & Observation', icon: '👁',  color: '#f97316' },
      ING: { label: 'Ingenierie du Climat',    icon: '⚙️', color: '#8b5cf6' },
      NEU: { label: 'Neurosciences',           icon: '🧠', color: '#3b82f6' },
      POS: { label: 'Posture & Ethique',       icon: '⚖️', color: '#e2a84b' },
      PSY: { label: 'Sante Psychique',         icon: '💙', color: '#06b6d4' },
      REV: { label: 'Appui Academique',        icon: '📖', color: '#10b981' },
      SSM: { label: 'Sentinelle Sante Mentale',icon: '🛡️', color: '#a78bfa' },
      VEA: { label: 'Vivre Ensemble Actif',    icon: '🤝', color: '#84cc16' }
    }
  };

  console.log('[EpicteteHelpers] v1.0 charge — ' +
    Object.keys(EPICTETE_RAG_KB).length + ' piliers, ' +
    Object.values(EPICTETE_RAG_KB).reduce(function(s,a){return s+a.length;},0) + ' entrees RAG.');
})();
