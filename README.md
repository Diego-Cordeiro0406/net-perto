# NetPerto

> Encontre e compare opções de internet para sua região.

O **NetPerto** é uma plataforma criada para facilitar a busca por provedores e planos de internet fixa.

A proposta é reunir, em um único lugar, informações sobre provedores de internet disponíveis em uma determinada região, incluindo **provedores locais e regionais que podem não aparecer em grandes comparadores nacionais**.

Inicialmente, o projeto será focado na cidade de **Petrolina, Pernambuco**, com possibilidade de expansão para outras cidades futuramente.

---

## 📌 O problema

Quando uma pessoa precisa contratar uma internet fixa para sua casa, encontrar as opções disponíveis pode ser um processo cansativo e fragmentado.

Normalmente, é necessário pesquisar individualmente por diferentes provedores utilizando canais como:

* Google;
* Sites oficiais;
* Instagram;
* WhatsApp;
* Anúncios;
* Recomendações de conhecidos.

Além disso, o usuário precisa descobrir:

* Quais provedores atendem sua região;
* Quais planos estão disponíveis;
* Os preços dos planos;
* As velocidades oferecidas;
* Quais opções oferecem um melhor custo-benefício.

Embora existam plataformas nacionais para comparação de planos de internet, provedores locais e regionais podem não estar adequadamente representados.

O **NetPerto** busca centralizar essas informações.

---

## 💡 A solução

O NetPerto permitirá que o usuário informe sua localização e encontre opções de internet fixa disponíveis ou potencialmente disponíveis em sua região.

A plataforma reunirá informações como:

* Provedores de internet;
* Planos;
* Preços;
* Velocidades;
* Informações sobre cobertura;
* Links para os canais oficiais dos provedores.

### Fluxo principal

```text
Usuário acessa o NetPerto
        ↓
Informa seu Bairro
        ↓
Encontra provedores para sua região
        ↓
Visualiza planos, preços e velocidades
        ↓
Acessa o provedor escolhido
```

---

## 🎯 Público-alvo

O NetPerto é voltado inicialmente para pessoas que estão procurando uma nova opção de internet fixa.

### 🏠 Pessoas que acabaram de se mudar

Usuários que se mudaram recentemente e precisam contratar internet para uma nova residência.

Essas pessoas podem não conhecer os provedores disponíveis na região.

### 🔄 Pessoas que desejam trocar de provedor

Usuários que não estão satisfeitos com sua internet atual e procuram alternativas.

Alguns possíveis motivos incluem:

* Lentidão;
* Quedas frequentes;
* Preço elevado;
* Atendimento insatisfatório;
* Velocidade abaixo do esperado.

---

## ⭐ Proposta de valor

> **Encontre e compare opções de internet para sua região sem precisar pesquisar provedor por provedor.**

O principal diferencial do NetPerto será ajudar usuários a descobrir também **provedores locais e regionais**, que podem ser mais difíceis de encontrar através de buscas tradicionais ou grandes comparadores nacionais.

---

# 🚀 MVP

O objetivo inicial é validar se usuários realmente se beneficiam de uma plataforma centralizada para encontrar opções de internet em sua região.

O MVP será focado na cidade de **Petrolina - PE**.

## Funcionalidades iniciais

### 🔎 Busca por Bairro

O usuário poderá informar seu Bairro para visualizar informações relacionadas à sua região.

### 📡 Lista de provedores

A aplicação exibirá os provedores encontrados para o Bairro pesquisado.

### 📶 Informações de cobertura

Cada provedor poderá possuir diferentes informações sobre cobertura.

Exemplos:

* 🟢 Cobertura confirmada;
* 🟡 Atua na região, mas a cobertura deve ser confirmada;
* ⚪ Sem dados suficientes;
* 🔴 Cobertura não disponível.

### 💰 Planos

A plataforma exibirá informações como:

* Nome do plano;
* Velocidade;
* Preço;
* Data da última atualização.

### 🔗 Canais oficiais

O usuário poderá acessar os canais oficiais do provedor, como:

* Site;
* WhatsApp;
* Outros canais de contato.

---

## ❌ Fora do escopo inicial

As seguintes funcionalidades não fazem parte do MVP:

* Sistema de login;
* Avaliações de usuários;
* Comentários;
* Favoritos;
* Aplicativo mobile;
* Painel para provedores;
* Mapa de cobertura;
* Integração automática com provedores;
* Comparação avançada de planos;
* Sistema automático de atualização de dados.

Essas funcionalidades poderão ser avaliadas futuramente.

---

# 🗺️ Cobertura e confiabilidade dos dados

A disponibilidade de internet pode variar de acordo com:

```text
Cidade
  ↓
Bairro
  ↓
Rua
  ↓
Número
```

Por esse motivo, o NetPerto não deve afirmar que um provedor possui cobertura em uma localização sem informações confiáveis.

Os dados de cobertura poderão possuir diferentes níveis de confirmação.

| Status          | Descrição                                                                |
| --------------- | ------------------------------------------------------------------------ |
| `available`     | Cobertura confirmada para o Bairro                                       |
| `unknown`       | Não existem dados suficientes sobre a cobertura                          |
| `not_available` | O provedor confirmou que não atende a região                             |

A transparência dos dados será uma parte importante da plataforma.

---

# 🛠️ Tecnologias

## Frontend

* [Vite](https://vite.dev/)
* [React](https://react.dev/)
* [TypeScript](https://www.typescriptlang.org/)

## Interface

* [Tailwind CSS](https://tailwindcss.com/)
* [shadcn/ui](https://ui.shadcn.com/)
* [Lucide Icons](https://lucide.dev/)

## Formulários e validação

* React Hook Form
* Zod

## Gerenciamento de dados

* TanStack Query

## Banco de dados e Backend

* [Supabase](https://supabase.com/)
* PostgreSQL

## Navegação

* React Router

---

# 🏗️ Arquitetura

Inicialmente, o projeto utilizará uma arquitetura simples:

```text
┌───────────────────────────┐
│                           │
│      React + Vite         │
│                           │
│      TypeScript           │
│      Tailwind CSS         │
│      shadcn/ui            │
│                           │
└─────────────┬─────────────┘
              │
              │
              ▼
┌───────────────────────────┐
│                           │
│         Supabase          │
│                           │
│        PostgreSQL         │
│                           │
│           RLS             │
│                           │
└───────────────────────────┘
```

Inicialmente, não será utilizado um backend separado.

Caso seja necessário futuramente, o Supabase poderá ser utilizado para implementar funcionalidades adicionais através de:

* Edge Functions;
* APIs;
* Integrações externas;
* Processamento de dados.

---

# 🗄️ Modelagem inicial do banco

O banco de dados inicialmente será composto por três entidades principais.

## Providers

Armazena informações sobre os provedores.

```text
providers
```

| Campo        | Descrição                  |
| ------------ | -------------------------- |
| `id`         | Identificador              |
| `name`       | Nome do provedor           |
| `website`    | Site oficial               |
| `whatsapp`   | WhatsApp                   |
| `created_at` | Data de criação            |
| `updated_at` | Data da última atualização |
| `logo_url`   | Logo do provedor           |

---

## Plans

Armazena os planos oferecidos pelos provedores.

```text
plans
```

| Campo               | Descrição                       |
| -----------------   | ------------------------------- |
| `id`                | Identificador                   |
| `provider_id`       | Provedor responsável pelo plano |
| `name`              | Nome do plano                   |
| `download_speed`    | Velocidade de download          |
| `price`             | Preço                           |
| `source_url`        | Fonte da informação             |
| `last_checked_at`   | Última verificação              |
| `created_at`        | Data de criação                 |
| `updated_at`        | Data da última atualização      |
| `promotional_price` | Preço promocial                 |
| `promotional_months`| Tempo da promoção               |
| `benefits`          | Beneficios incluidos no plano   |
| `installation_fee`  | Taxa de instalação              |
| `contract_months`   | Tempo de fidelidade             |
| `is_active`         | Plano ativo ou inativo          |
| `wifi_type`         | Tipo do wi-fi oferecido no plano|

### Relação

```text
Provider 1 ───── N Plans
```

Um provedor pode possuir vários planos.

Cada plano pertence a apenas um provedor.

---

## Provider Coverage

Armazena informações sobre a cobertura dos provedores.

```text
provider_coverage
```

| Campo               | Descrição                     |
| -----------------   | --------------------------    |
| `id`                | Identificador                 |
| `provider_id`       | Provedor                      |
| `neighborhood`      | Bairro                        |
| `neighborhood_id`   | Bairro relacionado a cobertura|
| `status`            | Status da cobertura           |
| `source`            | Fonte da informação           |
| `last_checked_at`   | Última verificação            |
| `created_at`        | Data de criação               |
| `updated_at`        | Data da última atualização    |

### Relação

```text
Provider 1 ───── N Provider Coverage
```

Um provedor pode possuir informações de cobertura para diversos CEPs.

---

## Neighborhoods

Armazena informações sobre os bairros da cidade(apenas Petrolina atualmente).

```text
neighborhoods
```

| Campo               | Descrição                            |
| --------------------| -------------------------------------|
| `id`                | Identificador                        |
| `name`              | nome do bairro                       |
| `normalized_name`   | nome do bairro normalizado           |
| `neighborhood_id`   | Bairro relacionado a cobertura       |
| `city`              | cidade onde o bairro está localizado |
| `state`             | estado onde o bairro está localizado |
| `created_at`        | Data de criação                      |
| `updated_at`        | Data da última atualização           |

### Relação

```text
Neighborhood 1 ───── N Provider Coverage
```

Um bairro pode estar associado a diversas coberturas.

---

## Estrutura

```text
                    ┌─────────────┐
                    │  providers  │
                    ├─────────────┤
                    │ id          │
                    │ name        │
                    │ website     │
                    │ whatsapp    │
                    └──────┬──────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                │ 1                   │ 1
                │                     │
                ▼ N                   ▼ N
          ┌────────────┐         ┌───────────────────┐
          │   plans    │         │ provider_coverage │
          ├────────────┤         ├───────────────────┤
          │ id         │         │ id                │
          │ provider_id│         │ provider_id       │
          │ name       │         │ zip_code          │
          │ price      │         │ status            │
          │ speed      │         │ source            │
          └────────────┘         └───────────────────┘
                                         │
                                         │
                                         │ N
                                         │
                                         ▼ 1
                                 ┌───────────────────┐
                                 │ neighborhoods     │
                                 ├───────────────────┤
                                 │ id                │
                                 │ name              │
                                 │ normalized_name   │
                                 │ neighborhood_id   │
                                 │ city              │
                                 │ state             │
                                 └───────────────────┘

---

# 📊 Métricas

O MVP poderá registrar alguns eventos importantes para validar a utilização da plataforma.

Exemplos:

```text
search_performed
provider_viewed
provider_link_clicked
```

Essas informações poderão ajudar a responder perguntas como:

* Quais regiões possuem mais pesquisas?
* Quais provedores recebem mais interesse?
* Quais planos são mais visualizados?
* Quantos usuários pesquisam por CEP?
* Quantos usuários acessam os canais dos provedores?

---

# 🔮 Possíveis funcionalidades futuras

Após a validação do MVP, algumas funcionalidades poderão ser consideradas.

### ⭐ Comparação de planos

Permitir que o usuário compare diferentes provedores e planos.

### 💰 Melhor custo-benefício

Exibir métricas como:

```text
Preço por Mbps
```

### ❤️ Favoritos

Permitir que usuários salvem provedores ou planos.

### ⭐ Avaliações

Permitir que usuários avaliem provedores.

No futuro, as avaliações poderiam ser específicas por região.

Exemplo:

```text
JR Telecom

Avaliação em Petrolina
⭐⭐⭐⭐☆
```

Ou até mesmo:

```text
JR Telecom

Avaliação no bairro Areia Branca
⭐⭐⭐⭐☆
```

### 🏢 Painel para provedores

Permitir que provedores atualizem informações como:

* Planos;
* Preços;
* Áreas atendidas;
* Canais de contato.

### 🔄 Atualização automática

Automatizar a atualização de informações através de:

* APIs;
* Integrações;
* Outras fontes autorizadas.

### 📍 Expansão geográfica

Após validar o projeto em Petrolina, a plataforma poderá ser expandida para outras cidades.

---

# 📍 Foco inicial

O NetPerto começará em:

```text
Petrolina - Pernambuco
```

A estratégia inicial será concentrar esforços em uma única cidade para:

* Construir uma base de dados confiável;
* Conhecer os provedores locais;
* Validar a proposta;
* Entender o comportamento dos usuários.

Após a validação, outras cidades poderão ser adicionadas.

---

# 🤝 Contribuição

O projeto está em fase inicial de desenvolvimento.

Sugestões e ideias são bem-vindas.

---

# 📄 Status do projeto

🚧 **Em desenvolvimento**

O NetPerto está atualmente na fase de definição e construção do MVP.

---
