document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('calcularBtn');
  if (!btn) return;

  btn.addEventListener('click', function () {
    const kmMes = Number(document.getElementById('kmMes').value || 0);
    const kmLitro = Number(document.getElementById('kmLitro').value || 0);
    const precoLitro = Number(document.getElementById('precoLitro').value || 0);

    if (kmLitro <= 0) {
      document.getElementById('resultado').textContent = 'Informe um rendimento maior que zero.';
      return;
    }

    const litros = kmMes / kmLitro;
    const custo = litros * precoLitro;

    document.getElementById('resultado').textContent =
      `Consumo: ${litros.toFixed(2)} l | Custo: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(custo)}`;
  });
});
