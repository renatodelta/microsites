document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('calcularBtn');
  if (!btn) return;

  const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  btn.addEventListener('click', function () {
    const consumoMensal = Number(document.getElementById('consumoMensal').value || 0);
    const tarifa = Number(document.getElementById('tarifa').value || 0);
    const fatorProducao = Number(document.getElementById('fatorProducao').value || 0);
    const custoKwp = Number(document.getElementById('custoKwp').value || 0);

    const tamanhoSistemaKwp = fatorProducao > 0 ? consumoMensal / fatorProducao : 0;
    const investimento = tamanhoSistemaKwp * custoKwp;
    const economiaMensal = consumoMensal * tarifa;
    const paybackMeses = economiaMensal > 0 ? investimento / economiaMensal : 0;

    document.getElementById('resultado').textContent =
      'Sistema estimado: ' + tamanhoSistemaKwp.toFixed(2) + ' kWp | Investimento: ' + moeda.format(investimento) +
      ' | Payback: ' + paybackMeses.toFixed(1) + ' meses';
  });
});
