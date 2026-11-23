import comuniJson from "comuni-json/comuni.json";

type Municipality = {
  nome: string;
  regione: { nome: string };
};

const municipalities = comuniJson as Municipality[];

export const PUGLIA_MUNICIPALITIES = municipalities
  .filter(({ regione }) => ["Puglia", "Molise", "Basilicata"].includes(regione.nome))
  .map(({ nome }) => nome)
  .filter((nome, index, all) => all.indexOf(nome) === index)
  .sort((a, b) => a.localeCompare(b, "it")) as readonly string[];

export function normalizeMunicipality(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
}
