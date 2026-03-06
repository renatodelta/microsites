document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('calcularBtn');
  if (!btn) return;

  const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  btn.addEventListener('click', function () {
    const potencia = Number(document.getElementById('potencia').value || 0);
    const minutosBanho = Number(document.getElementById('minutosBanho').value || 0);
    const pessoas = Number(document.getElementById('pessoas').value || 0);
    const tarifa = Number(document.getElementById('tarifa').value || 0);

    const horasMes = (minutosBanho / 60) * pessoas * 30;
    const consumoKwh = (potencia * horasMes) / 1000;
    const custo = consumoKwh * tarifa;

    document.getElementById('resultado').textContent =
      'Consumo do chuveiro: ' + consumoKwh.toFixed(2) + ' kWh/mês | Custo: ' + moeda.format(custo);
  });
});
