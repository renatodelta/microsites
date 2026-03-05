document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('calcularBtn');
  if (!btn) return;

  btn.addEventListener('click', function () {
    const valor1 = Number(document.getElementById('valor1').value || 0);
    const valor2 = Number(document.getElementById('valor2').value || 0);
    const resultado = valor1 + valor2;

    document.getElementById('resultado').textContent =
      'Resultado: ' + new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resultado);
  });
});
