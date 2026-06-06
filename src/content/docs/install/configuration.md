---
title: Configuration reference
description: The .machhub.yaml configuration file — app ports, auth keys, storage, argon2, CORS, proxy, and logging — plus environment-variable overrides.
sidebar:
  order: 2
---

MACHHUB Platform is configured with a single YAML file, by default
`/etc/machhub/.machhub.yaml`. Override the path with the `-c` / `--config` flag:

```bash
machhub start -c "/etc/machhub/.machhub.yaml"
```

## Sections

```yaml
app:
  host: 0.0.0.0
  port: 6188              # REST API / console port (default)
  mochi:                  # embedded MQTT broker
    tcp_port: 1883        # MQTT over TCP
    ws_port: 180          # MQTT over WebSocket (for browsers)
  nats:
    port: 4222            # embedded NATS

auth:
  issuer: machhub.localhost
  ttl: 24                 # JWT lifetime, in hours
  auds: [idt_machhub_edge]
  required_aud: idt_machhub_edge
  priv_key: ...           # ed25519 private key (EdDSA JWT signing)
  pub_key: ...            # ed25519 public key
  kid: ...                # key id
  policy: policy.csv      # Casbin policy
  group: group.csv        # Casbin grouping
  model: model.conf       # Casbin model

storage:                  # primary datastore (SurrealDB)
  use: surrealdb
  uri: ws://localhost:7018/rpc
  dbname: machhub
  credentials:
    username: admin
    password: admin

data_storage:             # time-series storage option
  use: questdb
  uri: http://localhost:9000

argon2:                   # password hashing parameters
  memory: 65526
  iterations: 2
  parallelism: 2
  salt_length: 4
  key_length: 16

cors:
  enabled: true
  origins: ["*"]

proxy:                    # optional reverse-proxy balancer
  enabled: false
  servers: []

logging:
  level: info             # info | debug | ...
```

## Key settings explained

| Setting | Notes |
| --- | --- |
| `app.port` | The REST API / console port (default `6188`). |
| `app.mochi.*` | The embedded MQTT broker's TCP and WebSocket ports. Browsers connect over WebSocket. |
| `app.nats.port` | The embedded NATS server, used to dispatch Process execution. |
| `auth.ttl` | JWT lifetime in hours. There are **no refresh tokens** — clients re-login on expiry. |
| `auth.priv_key` / `pub_key` / `kid` | The ed25519 keypair used to sign and verify JWTs. |
| `storage.uri` | SurrealDB RPC endpoint (internal). |
| `data_storage` | Legacy time-series setting (e.g. `use: questdb`). It is **not used** in current builds — the Historian is implemented on SurrealDB — and can be left at its default. |

## Environment variable overrides

The server reads environment variables (via Viper's automatic env binding). The auth
keys in particular can be supplied from the environment instead of the file:

| Variable | Overrides |
| --- | --- |
| `MCH_AUTH_PRIV_KEY` | `auth.priv_key` |
| `MCH_AUTH_PUB_KEY` | `auth.pub_key` |
| `MCH_AUTH_KEYID` | `auth.kid` |
| `MCH_SURREAL_USERNAME` | `storage.credentials.username` |
| `MCH_SURREAL_PASSWORD` | `storage.credentials.password` |

:::tip
Keep secrets (the auth private key, database credentials) out of the YAML file in
production by supplying them through environment variables.
:::

## CORS

If browser apps on other origins will call the API, enable CORS and list their
origins under `cors.origins`.

Next: [Run from source](/install/run-from-source/) or [First login](/install/first-login/).
