document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('calcularBtn');
  if (!btn) return;

  btn.addEventListener('click', function () {
    const potenciaW = Number(document.getElementById('potenciaW').value || 0);
    const horasDia = Number(document.getElementById('horasDia').value || 0);
    const diasMes = Number(document.getElementById('diasMes').value || 0);
    const tarifaKwh = Number(document.getElementById('tarifaKwh').value || 0);

    const consumoKwh = (potenciaW / 1000) * horasDia * diasMes;
    const custo = consumoKwh * tarifaKwh;

    document.getElementById('resultado').textContent =
      `Consumo: ${consumoKwh.toFixed(2)} kWh | Custo: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(custo)}`;
  });
});
