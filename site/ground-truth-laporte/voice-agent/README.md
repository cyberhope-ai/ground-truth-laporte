# Ground Truth LaPorte — Phone Information Line

**🟢 LIVE — call (219) 258-3479.** A La Porte-local phone number that residents can call to
ask anything about the Microsoft data center project. The agent answers from the *same sealed
record* that powers the website — every figure carries its receipt, and anything not yet in the
public record is answered with "that isn't in the public record yet" plus who could publish it.

## Stack (the proven CyberHopeAI voice pattern)

**Twilio (phone) → ElevenLabs Conversational AI (voice + brain).** Same method as the
Video Game Palooza and DreamAuthentics lines. Inbound calls hit the Twilio number, whose
VoiceUrl is `https://api.elevenlabs.io/twilio/inbound_call`, which hands the call to the
ElevenLabs agent below.

| Piece | Value |
|---|---|
| Phone number | **+1 (219) 258-3479** (La Porte, IN) |
| Twilio account | CyberHopeAI (shared nonprofit account) · PN SID `PN630ba343c7668a1f8d4c3855c455a025` |
| ElevenLabs agent | `agent_3601m179vt1gfn1t94nn5mhaq4f6` — "Ground Truth LaPorte — Information Line" |
| ElevenLabs phone id | `phnum_1201m17a02bzek6bym2j3n9z1hzh` |
| Voice | Bella — Professional, Bright, Warm (`hpp4J3VqNfWAUOO0d1Us`), `eleven_turbo_v2` |
| LLM | gpt-4o-mini · temperature 0.3 |
| Knowledge base | `DeQMhznl8Zeuq2xn32At` — RAG on (`multilingual_e5_large_instruct`) |

Full machine-readable detail: [`config.json`](./config.json). **No secrets are stored here** —
the ElevenLabs and Twilio API keys live only in `~/.pcos-secrets/`.

## Files

- `agent-system-prompt.md` — the agent's system prompt (neutrality, no-hallucination, cite-the-receipt rules).
- `gen-knowledge.ts` — generates the knowledge base from the site's canonical data layer.
- `knowledge/laporte-record.md` — the generated knowledge base (uploaded to ElevenLabs).

## The knowledge base is generated from the site — one source of truth

The phone agent's knowledge base is **not** hand-written or crawled from the live SPA (which
returns an empty shell to crawlers). It is generated straight from
[`client/src/lib/data.ts`](../client/src/lib/data.ts) — the exact canonical data layer the
website and the sitewide search engine (`server/search.ts`) read from. So the phone line, the
website, and the search box all answer from the same sealed record.

### Regenerate after the record changes

```bash
npx tsx voice-agent/gen-knowledge.ts > voice-agent/knowledge/laporte-record.md
```

Then re-upload it to ElevenLabs (replace the knowledge-base document `DeQMhznl8Zeuq2xn32At`
via the dashboard, or POST a new one to `/v1/convai/knowledge-base/file` and re-attach), and
re-run the RAG index. Live DB content (meetings, verified vault submissions) is *not* in this
static export yet — a future enhancement is a small endpoint that appends the DB corpus.

## Edit the agent live

ElevenLabs dashboard → Conversational AI → **Ground Truth LaPorte — Information Line**. You can
change the system prompt, voice, or first message with no re-wire.
