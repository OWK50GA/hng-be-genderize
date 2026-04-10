# Genderize

A lightweight REST API built with Express and TypeScript for classifying names.

## Requirements

- Node.js 18+
- pnpm

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

Starts the server on port `3001` with hot reload via `tsx watch`.

> **Note:** `--watch src` is required explicitly due to a known [tsx bug](https://github.com/esbuild-kit/tsx/issues/246) on Node.js 20+ where only the entry file is tracked for changes.

## Build

```bash
pnpm build
```

Compiles TypeScript to `dist/`.

## Production

```bash
pnpm start
```

Runs the compiled output from `dist/index.js`.

## API

### `GET /api/health`

Returns the health status of the server.

**Response**

```json
{
  "status": "Healthy",
  "timestamp": "2026-04-10T00:00:00.000Z"
}
```

### `GET /api/classify?name=<name>`

Predicts the gender of a given name by querying the [Genderize.io](https://genderize.io) external API. Returns the predicted gender along with a confidence level derived from the probability and the sample size used to make the prediction. It also handles the case where there is no prediction from Genderize.io i.e. ```gender: null```

**Query Parameters**

| Parameter | Type   | Required | Description          |
|-----------|--------|----------|----------------------|
| `name`    | string | Yes      | The name to classify |

**Response**

```json
{
 "status": "success",
 "data": {
  "name": "<name>",
  "gender": "male",
  "probability": 0.99,
  "sample_size": 1234,
  "is_confident": true,
  "processed_at": "2026-04-01T12:00:00Z"
 }
}
```

- `probability` — confidence level of the prediction, from `0` to `1`
- `count` — sample size the prediction is based on; higher values indicate a more reliable result

**Error Responses**

| Status | Reason                                              |
|--------|-----------------------------------------------------|
| `400`  | `name` query parameter is missing or empty          |
| `422`  | Unprocessable entity — the name could not be classified |
| `502`  | External API (Genderize.io) returned an error       |
| `500`  | Internal server error                               |

## Project Structure

```
src/
├── index.ts          # Entry point, Express app setup
└── routes/
    └── classify.ts   # Classification routes
```
