export const PUGLIA_MUNICIPALITIES = [
  "Acquaviva delle Fonti","Adelfia","Alberobello","Alberona","Alessano","Alezio","Alliste","Altamura","Andria","Andrano","Anzano di Puglia","Apricena","Aradeo","Arnesano","Ascoli Satriano","Avetrana",
  "Bari","Barletta","Binetto","Bitetto","Bitonto","Bitritto","Bisceglie","Botrugno","Bovino","Brindisi",
  "Cagnano Varano","Canosa di Puglia","Caprarica di Lecce","Capurso","Carapelle","Carbonara di Bari","Casamassima","Casarano","Cassano delle Murge","Castellana Grotte","Castrignano del Capo","Cavallino","Ceglie Messapica","Celino San Marco","Cerignola","Cisternino","Conversano","Copertino","Corato","Cursi",
  "Deliceto","Francavilla Fontana",
  "Gallipoli","Ginosa","Gioia del Colle","Giovinazzo","Gravina in Puglia","Grottaglie","Grumo Appula",
  "Laterza","Lecce","Lesina","Leverano","Lizzanello","Locorotondo","Lucera",
  "Manduria","Martano","Martina Franca","Maruggio","Massafra","Matino","Melendugno","Melissano","Molfetta","Monopoli","Monte Sant'Angelo","Monteiasi","Montemesola","Monteroni di Lecce","Mottola",
  "Nardò","Noci","Noicattaro","Novoli",
  "Oria","Ortanova","Ostuni",
  "Palagianello","Palo del Colle","Parabita","Poggiardo","Poggiofranco","Polignano a Mare","Putignano",
  "Racale","Ruvo di Puglia",
  "San Ferdinando di Puglia","San Giovanni Rotondo","San Marco in Lamis","San Nicandro Garganico","San Pietro Vernotico","San Severo","San Vito dei Normanni","Sannicandro di Bari","Sava","Squinzano","Surano",
  "Taranto","Terlizzi","Torre Santa Susanna","Torremaggiore","Toritto","Trani","Triggiano","Troia",
  "Ugento",
  "Valenzano",
  "Veglie","Vico del Gargano","Vieste",
  "Zapponeta"
] as const;

export function normalizeMunicipality(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
}
