# Firebase Setup Oshetu

Esta estrutura usa o plano gratuito Spark do Firebase e mantém fallback local quando o SDK ou a configuração não estiverem presentes.

## Ativar Firebase

1. Criar projeto no Firebase Console.
2. Ativar Authentication com Email/Password.
3. Criar Firestore Database em modo production.
4. Ativar Firebase Storage.
5. Preencher `js/config/firebase-config.js` com as chaves do projeto.
6. Abrir `pages/login.html` por servidor local ou hosting. As paginas ja carregam o SDK Firebase instalado em `node_modules/firebase`.

## SDK no HTML

As paginas ja carregam estes scripts antes dos servicos Oshetu:

```html
<script src="../node_modules/firebase/firebase-app-compat.js"></script>
<script src="../node_modules/firebase/firebase-auth-compat.js"></script>
<script src="../node_modules/firebase/firebase-firestore-compat.js"></script>
<script src="../node_modules/firebase/firebase-storage-compat.js"></script>
<script src="../js/config/firebase-config.js"></script>
```

Enquanto `firebase-config.js` estiver vazio, a plataforma mantém fallback local. Depois de preencher `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId` e `appId`, cadastro, login, sessão, Firestore e Storage passam a usar Firebase real.

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

## Migracao

Para enviar os dados demo/localStorage para Firestore depois de autenticar uma conta com permissao adequada:

```js
OshetuDatabaseService.seedFirestoreFromLocal();
```

Os dashboards chamam `OshetuDatabaseService.hydrateLocalCache()` ao abrir. Isso traz dados reais do Firestore para o formato atual dos paineis, preservando estilos, abas e UX.

## Regras

As regras estão em:

- `firestore.rules`
- `storage.rules`

O arquivo `firebase.json` aponta para ambas.
