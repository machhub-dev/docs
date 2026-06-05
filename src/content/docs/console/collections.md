---
title: Build a Collection
description: Create a Collection schema with the field-type picker, browse records, and add a record using typed inputs in the MACHHUB console.
sidebar:
  order: 4
---

[Collections](/concepts/collections/) are typed data tables. The
**Database · Collections** page (`/database/collections`) lets you define a
collection's schema and add records to it. This page walks through both.

## Prerequisites

- A signed-in session in a domain where you have **Collections** permission
  (see [Groups & permissions](/console/groups/)).
- Collections are scoped to the active [Domain](/concepts/domains/), so confirm the
  domain switcher is set to the right tenant first.

## The two-pane layout

The page is split into two resizable panes:

- **Left** — the **collection list**. Each entry shows the collection name and its
  field count, with a delete (trash) button. The **Add Collection** button sits at the
  bottom.
- **Right** — the **records table** for the selected collection, with a breadcrumb,
  a refresh button, and an **Add Record** button.

<figure>
  <div class="mh-shot">📷 Screenshot to capture: <strong>Collections</strong> (`/database/collections`) — two-pane view with a collection selected and several records. See <a href="/reference/shot-list/">shot-list</a> (#4).</div>
</figure>

## Create a schema

1. Click **Add Collection**. A panel slides in from the right.
2. Enter a **Name**. Names must start with a letter and contain only letters, numbers,
   and underscores.
3. Optionally add a **Description**.
4. Every collection starts with a locked **`id`** field (type *record*). You cannot
   rename or remove it — it is the record's primary key.
5. Click **Add Field** and pick a type from the picker, then type the field's name.
   Repeat for each field. Remove a field with its trash button.
6. Click **Save**.

<figure>
  <div class="mh-shot">🎞️ GIF to record: <strong>Create a collection</strong> — Add Collection → name it → add fields (String/Number/Relation) → Save → appears in list. See shot-list (Console GIF #2).</div>
</figure>

### Field types

The **Add Field** picker offers ten types:

| Type | Use it for |
| --- | --- |
| **String** | Text. |
| **Number** | Numeric values. |
| **Boolean** | True/false (a switch in the record form). |
| **URL** | A link. |
| **DateTime** | A date, picked from a calendar. |
| **File** | An uploaded file (stored inline). |
| **JSON** | An arbitrary JSON object, edited in a code box. |
| **Rich Editor** | Formatted rich-text content. |
| **Enum** | A value chosen from a fixed list of options. |
| **Relation** | A reference to a record in another collection. |

For a **Relation** field, a *Select a collection* dropdown appears next to the field
name — choose which collection it points at. (The `id` field's *record* type is the
built-in primary key and is not one of the ten pickable types.) You can also define
**Indexes** (unique or full-text) on the collection from the same form.

Saving sends the schema to `POST /api/collection`.

## Browse records

Select a collection in the left pane to load its records into the table on the right.
Each column renders according to its field type — for example, booleans show as a
checkmark, dates are formatted, JSON is stringified, and relations show the related
record's ID. Use the **refresh** button to re-fetch the data.

Each row has a **pencil** button to edit the record (it opens the same form,
pre-filled) and a **trash** button to delete it.

## Add a record

1. With a collection selected, click **Add Record**. A form slides in from the right
   with one input per field, typed to match the schema.
2. Fill the fields:
   - **`id`** is optional — leave it empty to auto-generate.
   - **String / Number / URL** use plain text/number inputs.
   - **Boolean** is a toggle switch.
   - **DateTime** opens a calendar.
   - **File** is a file upload.
   - **JSON** is a code box pre-filled with a small template.
   - **Relation** uses a record picker: click **Open picker**, search and select a
     record from the related collection, then **Set selection**.
3. Click **Save**. The record is sent to `POST /api/collection/data/<collectionID>` and
   the table refreshes.

<figure>
  <div class="mh-shot">🎞️ GIF to record: <strong>Add a record</strong> — Add Record → fill typed inputs (toggle a switch, pick a date, use the relation picker) → Save. See shot-list (Console GIF #3).</div>
</figure>

## Related

- [Collections (concept)](/concepts/collections/) — the data model and field types.
- [SDK · Collections](/sdk/collections/) — read and write the same collections from code.
