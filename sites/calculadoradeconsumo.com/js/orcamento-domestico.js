document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('calcularBtn');
  if (!btn) return;

  btn.addEventListener('click', function () {
    const renda = Number(document.getElementById('renda').value || 0);
    const moradia = Number(document.getElementById('moradia').value || 0);
    const alimentacao = Number(document.getElementById('alimentacao').value || 0);
    const transporte = Number(document.getElementById('transporte').value || 0);
    const outros = Number(document.getElementById('outros').value || 0);

    const totalDespesas = moradia + alimentacao + transporte + outros;
    const saldo = renda - totalDespesas;

    document.getElementById('resultado').textContent =
      `Despesas: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalDespesas)} | Saldo: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldo)}`;
  });
});
