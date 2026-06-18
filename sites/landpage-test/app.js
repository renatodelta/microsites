// Dados dos Segmentos para o Seletor Interativo
const segmentData = {
  padaria: {
    title: "Padarias & Confeitarias",
    desc: "Organize seus pães assados na hora, bolos, salgados e combos de café da manhã. Programe os horários de fornadas e permita que seus clientes comprem com agendamento de horário para retirada ou entrega quentinha.",
    benefits: [
      "Aviso de fornada quente",
      "Agendamento de retirada",
      "Combos personalizados",
      "Pedidos recorrentes no WhatsApp"
    ],
    items: [
      { name: "Pão Francês Quentinho", desc: "Forno de 1h em 1h", price: "R$ 0,70 / un", icon: "fa-solid fa-bread-slice" },
      { name: "Sonho Tradicional de Creme", desc: "Receita clássica artesanal", price: "R$ 5,50", icon: "fa-solid fa-cookie" },
      { name: "Bolo Caseiro de Fubá", desc: "Perfeito para café da tarde", price: "R$ 16,00", icon: "fa-solid fa-birthday-cake" }
    ]
  },
  mercado: {
    title: "Pequenos Mercados & Quitandas",
    desc: "Crie um catálogo digital completo com seções organizadas de hortifrúti, mercearia, bebidas e limpeza. Receba a lista de compras de forma limpa e facilite a separação e embalagem do pedido.",
    benefits: [
      "Divisão clara por seções",
      "Atualização rápida de preço",
      "Opção de entrega em domicílio",
      "Pedido mínimo configurável"
    ],
    items: [
      { name: "Caixa de Morangos Orgânicos", desc: "Bandeja fresca 250g", price: "R$ 7,90", icon: "fa-solid fa-apple-whole" },
      { name: "Arroz Agulhinha Tipo 1 - 5kg", desc: "Marca premium local", price: "R$ 26,90", icon: "fa-solid fa-seedling" },
      { name: "Leite Integral Caixinha 1L", desc: "Direto da fazenda", price: "R$ 4,50", icon: "fa-solid fa-glass-water" }
    ]
  },
  farmacia: {
    title: "Drogarias & Perfumarias",
    desc: "Permita que seus clientes encomendem medicamentos sem receita, itens de higiene pessoal, cosméticos e fraldas. Receba pedidos com upload de foto da receita para verificação rápida do farmacêutico.",
    benefits: [
      "Anexo de receita simplificado",
      "Entrega rápida e discreta",
      "Linha completa de perfumaria",
      "Histórico de uso do cliente"
    ],
    items: [
      { name: "Protetor Solar Corporal FPS 50", desc: "Fórmula não oleosa 120ml", price: "R$ 45,90", icon: "fa-solid fa-sun" },
      { name: "Fralda Descartável Pct M", desc: "Máximo conforto 32 un", price: "R$ 39,90", icon: "fa-solid fa-baby" },
      { name: "Sabonete Líquido Hidratante", desc: "Fragrância erva-doce 250ml", price: "R$ 11,90", icon: "fa-solid fa-pump-soap" }
    ]
  },
  restaurante: {
    title: "Restaurantes & Lanchonetes",
    desc: "Tenha um cardápio digital completo com escolha de adicionais, combos de refeições, tamanhos e observações de preparo direto para a cozinha. Ideal para pizzarias de bairro, hamburguerias e marmitarias.",
    benefits: [
      "Adicionais personalizados",
      "Configurador de Sabores (Pizzas)",
      "Impressão rápida de comanda",
      "Taxas de entrega por bairro/Km"
    ],
    items: [
      { name: "Pizza Meio a Meio Grande", desc: "Escolha calabresa/mussarela", price: "R$ 44,90", icon: "fa-solid fa-pizza-slice" },
      { name: "X-Burger Especial do Bairro", desc: "Hambúrguer 150g com queijo", price: "R$ 22,00", icon: "fa-solid fa-hamburger" },
      { name: "Suco Natural de Laranja 500ml", desc: "Sem conservantes", price: "R$ 8,00", icon: "fa-solid fa-blender" }
    ]
  }
};

// Inicializador e Gerenciador de Eventos
document.addEventListener("DOMContentLoaded", () => {
  // --- MÁSCARA DE TELEFONE/WHATSAPP (Inicializada primeiro por segurança) ---
  const whatsappInput = document.getElementById("whatsapp");
  if (whatsappInput) {
    // Bloqueia qualquer tecla que não seja número
    whatsappInput.addEventListener("keypress", (e) => {
      if (e.key < "0" || e.key > "9") {
        e.preventDefault();
      }
    });

    whatsappInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número
      if (value.length > 11) {
        value = value.slice(0, 11); // Limita a 11 dígitos
      }
      
      // Aplica a mesma formatação do aplicativo cliente da padaria (Celular vs Fixo)
      if (value.length > 10) {
        e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      } else if (value.length > 6) {
        e.target.value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
      } else if (value.length > 2) {
        e.target.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else if (value.length > 0) {
        e.target.value = `(${value}`;
      } else {
        e.target.value = "";
      }
    });
  }

  // 1. Mudança de Estilo do Header ao Rolar a Página
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }
  });

  // 2. Lógica das Abas do Seletor de Segmento
  const segmentTabs = document.querySelectorAll(".segment-tab");
  
  function updateSegment(segmentKey) {
    const data = segmentData[segmentKey];
    if (!data) return;

    // Atualiza texto e título
    document.getElementById("segment-title").textContent = data.title;
    document.getElementById("segment-desc").textContent = data.desc;

    // Atualiza lista de benefícios
    const benefitsContainer = document.getElementById("segment-benefits");
    benefitsContainer.innerHTML = "";
    data.benefits.forEach(benefit => {
      const item = document.createElement("div");
      item.className = "benefit-item";
      item.innerHTML = `<i class="fa-solid fa-circle-check"></i><span>${benefit}</span>`;
      benefitsContainer.appendChild(item);
    });

    // Atualiza a visualização do mockup
    const mockupContainer = document.getElementById("segment-mockup-content");
    mockupContainer.innerHTML = `
      <h3 style="font-family: var(--font-title); font-size: 20px; margin-bottom: 8px;">Catálogo da Loja</h3>
      <p style="font-size: 13px; color: var(--color-text-muted); margin-bottom: 16px;">
        <i class="fa-solid fa-location-dot" style="color: var(--color-primary); margin-right: 4px;"></i> Aberto hoje • Entrega Rápida
      </p>
    `;
    data.items.forEach(item => {
      const el = document.createElement("div");
      el.className = "mockup-item";
      el.innerHTML = `
        <div class="mockup-img"><i class="${item.icon}"></i></div>
        <div class="mockup-info">
          <h4>${item.name}</h4>
          <p>${item.desc}</p>
        </div>
        <div class="mockup-price">${item.price}</div>
      `;
      mockupContainer.appendChild(el);
    });
  }

  segmentTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      segmentTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const segmentKey = tab.getAttribute("data-segment");
      updateSegment(segmentKey);
    });
  });

  // Renderização inicial
  updateSegment("padaria");

  // 3. Lógica das Abas de Módulos (Como Funciona)
  const moduleTabs = document.querySelectorAll(".module-tab-btn");
  const moduleContents = document.querySelectorAll(".module-tab-content");

  moduleTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      moduleTabs.forEach(t => t.classList.remove("active"));
      moduleContents.forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      const moduleKey = tab.getAttribute("data-module");
      document.getElementById(`module-${moduleKey}`).classList.add("active");
    });
  });

  // 4. Acordeão do FAQ
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const faqHeader = item.querySelector(".faq-header");
    faqHeader.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      faqItems.forEach(i => i.classList.remove("active"));
      
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });

  // 5. Animações de Revelação por Rolagem (Reveal on Scroll)
  const reveals = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  reveals.forEach(reveal => {
    revealObserver.observe(reveal);
  });

  // 6. Formulário de Captura de Leads com Efeito Interativo
  const leadForm = document.getElementById("lead-form");
  const formSuccess = document.getElementById("form-success");

  leadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const submitBtn = leadForm.querySelector("button[type='submit']");
    
    // Mostra animação de envio
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Abrindo WhatsApp...`;
    
    // Captura valores do formulário
    const nome = document.getElementById("name").value.trim();
    const whatsapp = document.getElementById("whatsapp").value.trim();
    const comercio = document.getElementById("shop-name").value.trim();
    const segmentoSelect = document.getElementById("segment");
    const segmento = segmentoSelect.options[segmentoSelect.selectedIndex].text;
    const cidade = document.getElementById("city").value.trim();

    // Cria a mensagem estruturada
    const textoMsg = `Olá! Gostaria de contratar o Delivery 360.\n\n` +
      `*Nome:* ${nome}\n` +
      `*WhatsApp:* ${whatsapp}\n` +
      `*Comércio:* ${comercio}\n` +
      `*Segmento:* ${segmento}\n` +
      `*Cidade:* ${cidade}`;

    // Gera o link de redirecionamento para o suporte comercial (12) 99153-0244
    const urlMsg = `https://api.whatsapp.com/send?phone=5512991530244&text=${encodeURIComponent(textoMsg)}`;

    setTimeout(() => {
      // Exibe tela de sucesso na página
      leadForm.style.display = "none";
      formSuccess.style.display = "block";
      
      // Redireciona o usuário para o WhatsApp em uma nova aba
      window.open(urlMsg, '_blank');
    }, 1500);
  });
});
