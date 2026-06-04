---
title: File Handling
description: Upload File objects to collection file fields, retrieve file bytes as a Blob, display and delete files with the MACHHUB SDK.
sidebar:
  order: 8
---

Collections can have `file` fields. To upload, pass a browser `File` object into
`create` or `update`. On read, a file field returns the stored **filename string** — you
then fetch the bytes with `getFile`, which returns a `Blob` you can display or download.

## Uploading files

Pass the `File` object directly as the field value. Because `update` is a PATCH, you can
upload a file without touching other fields.

```typescript
import { getOrInitializeSDK } from './sdk.service';

const sdk = await getOrInitializeSDK();

// Create with a file
const file: File = /* from an <input type="file"> */;
await sdk.collection('products').create({
  name: 'Product Name',
  image: file  // pass the File object directly
});

// Update only the image field (PATCH)
await sdk.collection('products').update(
  'myapp.products:PROD-001',
  {
    image: file
  }
);

// Multiple file fields in one create
await sdk.collection('documents').create({
  title: 'Report',
  coverImage: imageFile,
  pdfDocument: pdfFile,
  attachments: zipFile
});
```

## Retrieving files

When you read a record, a file field is a **filename string**, not the bytes:

```typescript
const product = await sdk.collection('products')
  .getOne('myapp.products:PROD-001');

console.log(product.image); // "photo_12345.jpg" (string)
```

Fetch the actual bytes with `getFile(fileName, fieldName, recordID)`, which returns a
`Blob`. Display it with `URL.createObjectURL`, and call `URL.revokeObjectURL` when done
to avoid memory leaks.

```typescript
const sdk = await getOrInitializeSDK();
const collection = sdk.collection('products');

const product = await collection.getOne('myapp.products:PROD-001');

if (product.image) {
  const imageBlob = await collection.getFile(
    product.image,              // fileName (string from the API response)
    'image',                    // fieldName in the collection
    'myapp.products:PROD-001'   // recordID (full record ID)
  );

  const imageUrl = URL.createObjectURL(imageBlob);
  // <img src={imageUrl} alt="Product" />

  // Revoke when done
  URL.revokeObjectURL(imageUrl);
}
```

```mermaid
flowchart LR
  U["File object"] -->|create / update| API["MACHHUB"]
  API -->|getOne| FN["field = filename string"]
  FN -->|"getFile(fileName, fieldName, recordID)"| B["Blob"]
  B -->|createObjectURL| IMG["display / download"]
```

:::note[No direct file-URL method]
The SDK does not expose a method that returns a file URL. Always retrieve a `Blob` via
`getFile()` and create an object URL yourself with `URL.createObjectURL(blob)`.
:::

## Deleting a file

There is no dedicated delete-file call. Clear the field by updating it to `null`.

```typescript
await sdk.collection('products').update(
  'myapp.products:PROD-001',
  { image: null }
);
```

## File service example

A small service keeps file logic out of components, consistent with the
[service-layer architecture](/sdk/architecture/).

```typescript
// filepath: src/services/file.service.ts (excerpt)
import { getOrInitializeSDK } from './sdk.service';

class FileService {
  /** Upload a file into a record field (PATCH — only this field updates) */
  async uploadFile(
    collectionName: string,
    recordId: string,
    fieldName: string,
    file: File
  ): Promise<any> {
    const sdk = await getOrInitializeSDK();
    const fullId = `myapp.${collectionName}:${recordId}`;
    return await sdk.collection(collectionName).update(fullId, {
      [fieldName]: file
    });
  }

  /** Retrieve a file's bytes as a Blob */
  async getFile(
    collectionName: string,
    fileName: string,
    fieldName: string,
    recordID: string
  ): Promise<Blob | null> {
    if (!fileName) return null;
    const sdk = await getOrInitializeSDK();
    return await sdk.collection(collectionName).getFile(fileName, fieldName, recordID);
  }

  /** Get an object URL for display (remember to revoke it later) */
  async getFileUrl(
    collectionName: string,
    fileName: string,
    fieldName: string,
    recordID: string
  ): Promise<string | null> {
    const blob = await this.getFile(collectionName, fileName, fieldName, recordID);
    return blob ? URL.createObjectURL(blob) : null;
  }

  /** Delete a file by setting its field to null */
  async deleteFile(
    collectionName: string,
    recordId: string,
    fieldName: string
  ): Promise<void> {
    const sdk = await getOrInitializeSDK();
    const fullId = `myapp.${collectionName}:${recordId}`;
    await sdk.collection(collectionName).update(fullId, { [fieldName]: null });
  }
}

export const fileService = new FileService();
```

## Validation

Validate size and type before uploading.

```typescript
function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File too large (max 5MB)' };
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type' };
  }

  return { valid: true };
}
```

## Error handling

The server rejects oversized or unsupported files with standard HTTP status codes.

```typescript
async function uploadFile(file: File) {
  try {
    await fileService.uploadFile('products', productId, 'image', file);
  } catch (error: any) {
    if (error.status === 413) {
      console.error('File too large');          // 413 Payload Too Large
    } else if (error.status === 415) {
      console.error('Unsupported file type');    // 415 Unsupported Media Type
    } else {
      console.error('Upload failed');
    }
  }
}
```

## Checklist

- [ ] Upload by passing a `File` object (not a filename).
- [ ] Treat file fields as filename strings on read.
- [ ] Retrieve bytes with `getFile(fileName, fieldName, recordID)`.
- [ ] Display with `URL.createObjectURL`; revoke with `URL.revokeObjectURL`.
- [ ] Delete a file by updating its field to `null`.
- [ ] Validate size/type and handle `413`/`415` errors.

## Next

- Review CRUD and field types in [Collections](/sdk/collections/).
- See identifier rules in [Record IDs](/sdk/record-id/).
