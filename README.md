# 🏐 ACVB - Associação Clube de Voleibol | Plataforma Oficial

Next.js, TypeScript, Tailwind CSS, Prisma, MongoDB

Plataforma web completa desenvolvida para a gestão técnica, administrativa e pública da **Associação Clube de Voleibol (ACVB)**. O sistema possui um design moderno (Dark Mode/Esports), com áreas exclusivas para a diretoria, atletas e torcedores.

---

## ✨ Funcionalidades

O sistema é dividido em três grandes módulos funcionais:

### 🌐 Portal Público
* **Página Inicial:** Apresentação do time com design imersivo.
* **Elenco:** Exibição dinâmica dos atletas atualizada em tempo real.
* **Jogos & Desafios:** Calendário de partidas oficiais e formulário para equipes adversárias solicitarem amistosos.
* **Manto ACVB:** Sistema de reserva de uniformes com visualização dinâmica (troca automática entre os modelos Preto e Branco).

### 🛡️ Central de Comando (Painel Admin)
* **Acesso Restrito:** Rota protegida por senha para configurações do site.
* **Gestão de Amistosos:** Aprovação de desafios recebidos ou recusa.
* **Controle de Uniformes:** Tabela de pedidos pendentes com baixa automática e controle visual de status.
* **Gestão de Elenco:** Cadastro de novos atletas, definição de posição, numeração e geração de credenciais de acesso (E-mail e Senha inicial).

### 👤 Portal do Atleta
* **Autenticação:** Login individual para cada jogador cadastrado.
* **Perfil Customizável:** Edição autônoma de biografia e @ do Instagram.
* **Upload com Crop:** Envio de foto de perfil com ferramenta nativa de enquadramento/recorte (1:1) integrada via `react-easy-crop`, convertendo a imagem final em Base64 para armazenamento eficiente.

---

## 🚀 Tecnologias Utilizadas

* **Framework:** [Next.js 15](https://nextjs.org/) 
* **Linguagem:** TypeScript
* **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Banco de Dados:** [MongoDB](https://www.mongodb.com/)
* **ORM:** [Prisma 6](https://www.prisma.io/)
* **Ícones:** [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
* **Ferramentas Extras:** `react-easy-crop` (Recorte de imagens)

---

## ⚙️ Variáveis de Ambiente

Para o projeto funcionar corretamente e manter a segurança, você precisará criar um arquivo `.env` na raiz do projeto contendo as seguintes variáveis:

```env
# URL de conexão com o seu cluster do MongoDB Atlas
DATABASE_URL="mongodb+srv://<usuario>:<senha>@cluster.mongodb.net/acvb_volei?retryWrites=true&w=majority"

# Senha de acesso para o Painel Administrativo (/admin)
ADMIN_PASSWORD="sua_senha_admin"
```

Desenvolvido por Luiz Guilherme Alawi Grade para a Associação Clube de Voleibol.