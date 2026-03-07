document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('calcularBtn');
  if (!btn) return;

  const estadoSelect = document.getElementById('estado');
  const producaoInfo = document.getElementById('producaoInfo');

  const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const numero = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

  function atualizarInfoProducao() {
    if (!estadoSelect || !producaoInfo) return;
    const option = estadoSelect.options[estadoSelect.selectedIndex];
    const uf = option ? option.getAttribute('data-uf') : 'SP';
    const fator = Number(estadoSelect.value || 120);

    producaoInfo.textContent =
      'Produção média automática para ' + uf + ': ' + numero.format(fator) + ' kWh por kWp/mês.';
  }

  if (estadoSelect) {
    estadoSelect.addEventListener('change', atualizarInfoProducao);
  }

  atualizarInfoProducao();

  btn.addEventListener('click', function () {
    const consumoMensal = Number(document.getElementById('consumoMensal').value || 0);
    const tarifa = Number(document.getElementById('tarifa').value || 0);
    const fatorProducao = Number(estadoSelect ? estadoSelect.value : 0);
    const custoKwp = Number(document.getElementById('custoKwp').value || 0);
    const resultado = document.getElementById('resultado');

    if (consumoMensal <= 0 || tarifa <= 0 || fatorProducao <= 0 || custoKwp <= 0) {
      resultado.textContent = 'Preencha consumo, tarifa, estado e custo por kWp com valores maiores que zero.';
      return;
    }

    const tamanhoSistemaKwp = fatorProducao > 0 ? consumoMensal / fatorProducao : 0;
    const numeroPaineis = Math.ceil((tamanhoSistemaKwp * 1000) / 550);
    const investimento = tamanhoSistemaKwp * custoKwp;
    const economiaMensal = consumoMensal * tarifa;
    const paybackMeses = investimento / economiaMensal;
    const paybackAnos = paybackMeses / 12;

    resultado.innerHTML =
      'Potência do sistema necessário: <strong>' + numero.format(tamanhoSistemaKwp) + ' kWp</strong><br>' +
      'Número aproximado de painéis (550 W): <strong>' + numeroPaineis + ' painéis</strong><br>' +
      'Custo estimado do sistema: <strong>' + moeda.format(investimento) + '</strong><br>' +
      'Economia mensal: <strong>' + moeda.format(economiaMensal) + ' / mês</strong><br>' +
      'Tempo de retorno (payback): <strong>' + numero.format(paybackAnos) + ' anos</strong>';
  });
});
