document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('calcularBtn');
  if (!btn) return;

  const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  btn.addEventListener('click', function () {
    const consumoKwh = Number(document.getElementById('consumoKwh').value || 0);
    const tarifa = Number(document.getElementById('tarifa').value || 0);
    const bandeira = Number(document.getElementById('bandeira').value || 0);
    const impostos = Number(document.getElementById('impostos').value || 0);

    const subtotal = consumoKwh * (tarifa + bandeira);
    const total = subtotal * (1 + impostos / 100);

    document.getElementById('resultado').textContent =
      'Subtotal sem impostos: ' + moeda.format(subtotal) + ' | Total estimado: ' + moeda.format(total);
  });
});
