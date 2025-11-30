## Table of contents

- [Authentication (Auth)](#authentication-auth)
- [User](#user)
- [Financial groups](#financial-groups)
- [Financial positions](#financial-positions)
- [Public board (Board)](#public-board-board)
- [Admin](#admin)
- [Error format](#error-format)

---

## Authentication (Auth)

### Registration

**POST** `/auth/register`

Registers a new user with the `USER` role.

Body:

```json
{
  "login": "user1",
  "email": "user1@example.com",
  "password": "Password123"
}
```

````

Response `201 Created`:

```json
{
  "user": {
    "id": "664f1f...",
    "login": "user1",
    "email": "user1@example.com",
    "role": "USER"
  },
  "token": "JWT_TOKEN"
}
```

Possible errors:

- `400` – validation error (e.g. password too short, invalid email),
- `400` – login/email already exists.

---

### Login

**POST** `/auth/login`

Body:

```json
{
  "login": "user1",
  "password": "Password123"
}
```

Response `200 OK`:

```json
{
  "user": {
    "id": "664f1f...",
    "login": "user1",
    "email": "user1@example.com",
    "role": "USER"
  },
  "token": "JWT_TOKEN"
}
```

Errors:

- `401` – invalid login or password.

---

### JWT

Most endpoints require the header:

```http
Authorization: Bearer <JWT_TOKEN>
```

Token payload includes, among other things:

```json
{
  "sub": "<userId>",
  "role": "USER" | "ADMIN",
  ...
}
```

---

## User

### Current user data

**GET** `/users/me`
Requires: `Authorization: Bearer <token>`

Response `200 OK`:

```json
{
  "id": "664f1f...",
  "login": "user1",
  "email": "user1@example.com",
  "role": "USER",
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

Errors:

- `401` – missing or invalid token,
- `404` – user does not exist.

---

## Financial groups

Helper types:

- `visibilityStatus`: `"PRIVATE"` | `"PUBLIC"`

---

### Create group

**POST** `/groups`
Requires: `Authorization: Bearer <token>`

Body:

```json
{
  "name": "Mieszkanie",
  "projectionYears": 5,
  "visibilityStatus": "PRIVATE"
}
```

Response `201 Created`:

```json
{
  "id": "6650a0...",
  "name": "Mieszkanie",
  "projectionYears": 5,
  "visibilityStatus": "PRIVATE",
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

Errors:

- `400` – invalid data (validation),
- `401` – not authorized.

---

### User’s groups list

**GET** `/groups`
Requires: `Authorization: Bearer <token>`

Response `200 OK`:

```json
[
  {
    "id": "6650a0...",
    "name": "Mieszkanie",
    "projectionYears": 5,
    "visibilityStatus": "PRIVATE",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
]
```

---

### Group details + positions

**GET** `/groups/:groupId`
Requires: `Authorization: Bearer <token>`

Response `200 OK`:

```json
{
  "id": "6650a0...",
  "name": "Mieszkanie",
  "projectionYears": 5,
  "visibilityStatus": "PRIVATE",
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z",
  "positions": [
    {
      "id": "6650b1...",
      "name": "Czynsz",
      "amount": 2000,
      "positionType": "EXPENSE",
      "frequencyType": "RECURRING",
      "notes": "Komentarz",
      "category": "Mieszkanie",
      "interestRate": null,
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

Errors:

- `404` – group does not exist or does not belong to the user.

---

### Update group

**PATCH** `/groups/:groupId`
Requires: `Authorization: Bearer <token>`

Body (all fields optional):

```json
{
  "name": "Mieszkanie 2.0",
  "projectionYears": 7
}
```

Response `200 OK` – updated group (same shape as in GET).

---

### Change group visibility

**PATCH** `/groups/:groupId/visibility`
Requires: `Authorization: Bearer <token>`

Body:

```json
{
  "visibilityStatus": "PUBLIC"
}
```

Effect:

- Group visibility changes to `PUBLIC` / `PRIVATE`.
- Additionally: when set to `PUBLIC`, a board post is created / reactivated with initial `approvalStatus = "PENDING"`.

---

### Delete group

**DELETE** `/groups/:groupId`
Requires: `Authorization: Bearer <token>`

Response:

- `204 No Content` – group (and its positions) deleted.

---

## Financial positions

Types:

- `positionType`: `"EXPENSE"` | `"INCOME"`
- `frequencyType`: `"ONE_TIME"` | `"RECURRING"`

---

### Add position

**POST** `/groups/:groupId/positions`
Requires: `Authorization: Bearer <token>`

Body:

```json
{
  "name": "Czynsz",
  "amount": 2000,
  "positionType": "EXPENSE",
  "frequencyType": "RECURRING",
  "notes": "Komentarz",
  "category": "Mieszkanie"
}
```

Response `201 Created`:

```json
{
  "id": "6650b1...",
  "name": "Czynsz",
  "amount": 2000,
  "positionType": "EXPENSE",
  "frequencyType": "RECURRING",
  "notes": "Komentarz",
  "category": "Mieszkanie",
  "interestRate": null,
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

Errors:

- `404` – group does not exist / is not owned by the user.

---

### Update position

**PATCH** `/groups/:groupId/positions/:positionId`
Requires: `Authorization: Bearer <token>`

Body – all fields optional:

```json
{
  "amount": 2100,
  "notes": "Nowa kwota"
}
```

Response `200 OK` – updated position.

---

### Delete position

**DELETE** `/groups/:groupId/positions/:positionId`
Requires: `Authorization: Bearer <token>`

Response:

- `204 No Content` – position deleted.

---

## Public board (Board)

These endpoints are **public** (no JWT required).

---

### Board posts list

**GET** `/board`

Query params:

- `page` – page number (default `1`)
- `limit` – items per page (default `20`, max `100`)

Response `200 OK`:

```json
{
  "posts": [
    {
      "id": "6660a0...",
      "groupId": "6650a0...",
      "authorId": "664f1f...",
      "description": "Plan oszczędzania na mieszkanie",
      "publicationStatus": "VISIBLE",
      "approvalStatus": "APPROVED",
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

---

### Post details

**GET** `/board/:postId`

Response `200 OK`:

```json
{
  "id": "6660a0...",
  "groupId": "6650a0...",
  "authorId": "664f1f...",
  "description": "Plan oszczędzania na mieszkanie",
  "publicationStatus": "VISIBLE",
  "approvalStatus": "APPROVED",
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

Errors:

- `404` – post does not exist or is not `APPROVED` / `VISIBLE`.

---

## Admin

All admin endpoints require:

```http
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

The token must have `role: "ADMIN"`.

---

### Users list

**GET** `/admin/users`

Query params:

- `page` – page number (default `1`)
- `limit` – items per page (default `20`, max `100`)

Response:

```json
{
  "users": [
    {
      "id": "664f1f...",
      "login": "user1",
      "email": "user1@example.com",
      "role": "USER",
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

---

### Delete user

**DELETE** `/admin/users/:id`

Response:

- `204 No Content` – user (and their groups) deleted.

---

### Posts pending verification

**GET** `/admin/board/pending`

Query params are the same as for `/board`.

Response:

```json
{
  "posts": [
    {
      "id": "6660a0...",
      "groupId": "6650a0...",
      "authorId": "664f1f...",
      "description": "Plan oszczędzania na mieszkanie",
      "publicationStatus": "VISIBLE",
      "approvalStatus": "PENDING",
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

---

### Approve post

**POST** `/admin/board/posts/:postId/approve`

Response:

- `204 No Content` – post now has `approvalStatus = "APPROVED"`.

---

### Reject post

**POST** `/admin/board/posts/:postId/reject`

Response:

- `204 No Content` – post now has `approvalStatus = "REJECTED"`.

---

## Error format

The application returns a consistent error format:

```json
{
  "message": "Validation error",
  "details": { "...optional details..." }
}
```

Typical status codes:

- `400` – validation error / bad input,
- `401` – unauthorized (missing / invalid JWT),
- `403` – forbidden (e.g. user is not ADMIN),
- `404` – resource not found (group / position / post does not exist),
- `500` – server error (unexpected exception).

---

If you add new endpoints (e.g. financial forecast, expense categories), it’s a good idea to document them in this file using the same style: **method + path + body + example response + possible errors**.
````
