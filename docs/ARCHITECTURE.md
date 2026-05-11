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

## Firebase

`js/services/firebase.js`, `auth-service.js` e `database-service.js` preparam Authentication, Firestore e Storage com fallback local.
