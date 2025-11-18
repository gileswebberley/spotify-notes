import Dexie from 'dexie';

const db = new Dexie('SpotifyNotesDB');

//I'm struggling to decide what the best primary key is, but for now I'll just use an auto-incrementing id as two users might want to save different notes about the same track. I really wanted to have seperate stores per user which held all of their notes but Dexie doesn't seem to support dynamic store names so I think this is the best compromise for now. Should I have playlistId as well? Probably not as notes are per track really and tracks can be in multiple playlists.
db.version(1).stores({
  notes: '++id, userId, trackId',
});

//pop a test note in the db
db.on('populate', function (tx) {
  tx.notes.add({
    userId: '1198909265',
    trackId: '4xNl7wvrgaTDofpLenB9Mo',
    content: 'This is a test note for PUDDLE ( OF ME ) by Saya Gray',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
});

export async function getNotesByUserId(userId) {
  return db
    .transaction('r', db.notes, async () => {
      const userNotes = await db.notes.where('userId').equals(userId).toArray();
      return userNotes ?? [];
    })
    .catch((e) => {
      console.error(`Failed to get notes by userId ${userId}:`, e);
      throw e;
    });
}

export async function getUserNoteForTrack(userId, trackId) {
  //this worked but I believe using a transaction does more work in the background like looking after aborting etc
  // try {
  //   const note = await db.notes.where({ userId, trackId }).first();
  //   console.table('Fetched note:', note);
  //   return note;
  // } catch (e) {
  //   console.error(`Failed to get note for track id ${trackId}:`, e);
  //   throw e;
  // }
  return db
    .transaction('r', db.notes, async () => {
      const note = await db.notes.where({ userId, trackId }).first();
      return note ?? null;
    })
    .catch((e) => {
      console.error(`Failed to get note for track id ${trackId}:`, e);
      throw e;
    });
}

//rather than have a separate update and add function I'll just have one which does either depending on whether a note already exists for that userId and trackId
export async function saveNoteForTrack(userId, trackId, noteContent) {
  return db
    .transaction('rw', db.notes, async () => {
      const existingNote = await db.notes.where({ userId, trackId }).first();
      if (existingNote) {
        existingNote.content = noteContent;
        existingNote.updatedAt = new Date();
        await db.notes.put(existingNote);
        return existingNote;
      } else {
        const newNote = {
          userId,
          trackId,
          content: noteContent,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const id = await db.notes.add(newNote);
        newNote.id = id;
        return newNote;
      }
    })
    .catch((e) => {
      console.error(
        `Failed to save note for track id ${trackId} and user id ${userId}:`,
        e
      );
      throw e;
    });
}

export default db;
