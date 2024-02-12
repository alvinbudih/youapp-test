## API Reference

#### Register user

```http
  POST /api/register
```

| Body              | Type     | Description                         |
| :---------------- | :------- | :---------------------------------- |
| `username`        | `string` | **Required**. your username         |
| `email`           | `string` | **Required**. your email            |
| `password`        | `string` | **Required**. your password         |
| `confirmPassword` | `string` | **Required**. same as your password |

#### Login user

```http
  POST /api/login
```

| Body       | Type     | Description                 |
| :--------- | :------- | :-------------------------- |
| `email`    | `string` | **Required**. your email    |
| `password` | `string` | **Required**. your password |

#### Create profile

```http
  POST /api/createProfile/
```

| Header         | Type     | Description           |
| :------------- | :------- | :-------------------- |
| `access_token` | `string` | **Required**. [token] |

| Body             | Type     | Description                  |
| :--------------- | :------- | :--------------------------- |
| `displayName`    | `string` | **Required**. your full name |
| `gender`         | `string` | **Required**. your gender    |
| `birthday`       | `date`   | **Required**. your birthdate |
| `height`         | `number` | **Required**. your height    |
| `weight`         | `number` | **Required**. your height    |
| `profilePicrute` | `file`   | **Optional**. your picture   |

#### Get profile

```http
  GET /api/getProfile/
```

| Header         | Type     | Description           |
| :------------- | :------- | :-------------------- |
| `access_token` | `string` | **Required**. [token] |

#### Update profile

```http
  PATCH /api/updateProfile/
```

| Header         | Type     | Description           |
| :------------- | :------- | :-------------------- |
| `access_token` | `string` | **Required**. [token] |

| Body             | Type            | Description                  |
| :--------------- | :-------------- | :--------------------------- |
| `displayName`    | `string`        | **Optional**. your full name |
| `gender`         | `string`        | **Optional**. your gender    |
| `birthday`       | `date`          | **Optional**. your birthdate |
| `height`         | `number`        | **Optional**. your height    |
| `weight`         | `number`        | **Optional**. your height    |
| `profilePicrute` | `file`          | **Optional**. your picture   |
| `interests`      | `Array<string>` | **Optional**. your picture   |

#### Send message

```http
  POST /api/sendMessage/:userId
```

| Parameter | Type     | Description                                       |
| :-------- | :------- | :------------------------------------------------ |
| `userId`  | `string` | **Required**. user id that being your target chat |

| Header         | Type     | Description           |
| :------------- | :------- | :-------------------- |
| `access_token` | `string` | **Required**. [token] |

| Body    | Type     | Description                |
| :------ | :------- | :------------------------- |
| `value` | `string` | **Required**. your message |

#### View message

```http
  GET /api/viewMessage/:userId
```

| Parameter | Type     | Description                                          |
| :-------- | :------- | :--------------------------------------------------- |
| `userId`  | `string` | **Required**. user id that being your target to chat |

| Header         | Type     | Description           |
| :------------- | :------- | :-------------------- |
| `access_token` | `string` | **Required**. [token] |
