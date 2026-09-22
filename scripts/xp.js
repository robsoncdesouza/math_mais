export function pegarNivel(xp) {
    return Math.floor(xp / 1000) + 1;
}
export function pegarXpDoNivel(xp) {
    return xp % 1000;
}
export function pegarPorcentagemXp(xp) {
    return ((xp % 1000) / 1000) * 100;
}