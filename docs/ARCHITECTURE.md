# Arquitetura Oshetu

O projeto foi reorganizado para separar dados, serviços, dashboards, UI e utilitários.

```text
js/
  config/
  dashboard/
  data/
  services/
  ui/
  utils/
```

Dados principais ficam em `js/data/school-data.js`, e o contrato futuro para analytics/IA fica em `js/data/intelligence-schema.js`.

## Compatibilidade

Os arquivos antigos continuam existindo como wrappers:

- `js/school-data.js`
- `js/auth.js`
- `js/aluno.js`
- `js/professor.js`
- `js/gestao.js`

As páginas já apontam para a estrutura nova, mas os wrappers evitam quebra em referências antigas.

## IA Futura

`js/services/ai-service.js` centraliza prompts e funções mock para Gemini API:

- `generateStudentInsight`
- `generateTeacherInsight`
- `generateManagementInsight`
- `generateRecommendations`
- `generatePerformanceAnalysis`

## Arquitetura OSHETU Provincial

O OSHETU passa a ser organizado como uma plataforma hierarquica:

```text
Gabinete Provincial da Educacao
  -> Escolas
      -> Professores
          -> Alunos
```

O perfil `gestao` representa o Gabinete Provincial da Educacao e e o administrador superior da plataforma. Ele acompanha escolas, cobertura curricular, avaliacoes provinciais, indicadores de aprendizagem e alertas pedagogicos. O gabinete nao le conversas privadas nem mensagens pessoais entre professores e alunos; o escopo do painel central fica limitado a dados educacionais, estatisticas, progresso curricular e desempenho institucional.

Novas colecoes logicas:

- `schools`: cadastro institucional das escolas, municipio, nivel de ensino, contactos, NIF e codigo escolar.
- `curriculum`: topicos previstos por classe, disciplina e periodo letivo.
- `provincialAssessments`: testes emitidos pelo gabinete para verificar dominio curricular.
- `assessmentResponses`: respostas dos alunos em avaliacoes objetivas, com suporte offline-first.
- `aiInsights`, `recommendations`, `performanceAnalysis`: saidas geradas pelo Gemini.

## Gemini

`js/services/ai-service.js` agora funciona como conector principal de IA. Quando uma API key Gemini e configurada no painel de gestao, o servico chama a API generativa; quando nao ha chave ou rede, usa fallback local para manter a interface funcional.

Funcoes novas:

- `generateProvincialReport`
- `generateQuizFromCurriculum`

## Avaliacoes Offline-First

`js/services/offline-sync-service.js` salva respostas de testes provinciais primeiro no `localStorage`, calcula a pontuacao localmente e tenta sincronizar com Firebase. Se a rede falhar, a resposta entra numa fila `oshetu-offline-assessment-queue` e e reenviada automaticamente quando o navegador voltar a ficar online.

## Firebase

`js/services/firebase.js`, `auth-service.js` e `database-service.js` preparam Authentication, Firestore e Storage com fallback local.
