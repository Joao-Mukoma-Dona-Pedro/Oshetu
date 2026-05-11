# Firebase Setup Oshetu

Esta estrutura usa o plano gratuito Spark do Firebase e mantém fallback local quando o SDK ou a configuração não estiverem presentes.

## Ativar Firebase

1. Criar projeto no Firebase Console.
2. Ativar Authentication com Email/Password.
3. Criar Firestore Database em modo production.
4. Ativar Firebase Storage.
5. Copiar `js/config/firebase-config.example.js` para `js/config/firebase-config.js`.
6. Preencher as chaves do projeto.

## SDK no HTML

Quando quiser ativar Firebase real, carregar estes scripts antes dos serviços Oshetu:

```html
<script src="https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.5/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.5/firebase-storage-compat.js"></script>
<script src="../js/config/firebase-config.js"></script>
```

## Collections

- `users`
- `students`
- `teachers`
- `management`
- `classes`
- `turmas`
- `assignments`
- `lessons`
- `analytics`
- `notifications`
- `aiInsights`
- `recommendations`
- `performanceAnalysis`

## Serviços

- `js/services/firebase.js`
- `js/services/auth-service.js`
- `js/services/database-service.js`
- `js/services/ai-service.js`
- `js/services/analytics-service.js`

## Regras

As regras estão em:

- `firestore.rules`
- `storage.rules`

O arquivo `firebase.json` aponta para ambas.
