import { Assignment } from "./Assignment.js";

// Manages DB Calls
export class AssignmentManagement {
  static dbName = "trackit";
  static version = 1;

  // Opens connection to the indexedDB
  static async openDB() {
    const db = await idb.openDB(this.dbName, this.version, {
      upgrade(db, oldVersion, newVersion, transaction, event) {
        // Create a new object store
        db.createObjectStore("assignments", {
          keyPath: "id",
          autoIncrement: true,
        });
      },
      blocked(currentVersion, blockedVersion, event) {
        alert("Something went wrong !. See Logs");
        console.log(event);
      },
      blocking(currentVersion, blockedVersion, event) {
        alert("Something went wrong !. See Logs");
        console.log(event);
      },
      terminated() {
        alert("DB Connection closed !!!!");
      },
    });

    return db;
  }
  // add Assignment
  static async addAssignment(assignment) {
    const db = await AssignmentManagement.openDB();
    const tx = db.transaction("assignments", "readwrite");
    const objStore = tx.objectStore("assignments");

    await objStore.add(assignment);
    await tx.done;
    console.log("Added new Assignment ..");
    await db.close();
  }
  // deleting assignments by id
  static async deleteAssignment(id) {
    const db = await AssignmentManagement.openDB();
    const tx = db.transaction("assignments", "readwrite");
    const objStore = tx.objectStore("assignments");

    await objStore.delete(id);
    await tx.done;
    console.log(`Deleted assignment with id ${id}`);
    await db.close();
  }

  static async getAllAssignments() {
    const db = await AssignmentManagement.openDB();
    const tx = db.transaction("assignments", "readonly");
    const objStore = tx.objectStore("assignments");

    let results = await objStore.getAll();
    // Converting to Assignment objects
    for (let index = 0; index < results.length; index++) {
      results[0] = Object.assign(new Assignment(), results[0]);
    }
    await tx.done;
    console.log("Getting all assignments ...");
    await db.close();
    return results;
  }

  static async editAssignment(assignment) {
    const db = await AssignmentManagement.openDB();
    const tx = db.transaction("assignments", "readwrite");
    const objStore = tx.objectStore("assignments");

    await objStore.put(assignment);
    await tx.done;
    console.log(`Edited assignment with id : ${assignment.id}`);
    await db.close();
  }

  static async getLastIndex() {
    const db = await AssignmentManagement.openDB();
    const tx = db.transaction("assignments", "readwrite");
    const objStore = tx.objectStore("assignments");

    const cursorReq = await objStore.openCursor(null, "prev");
    // if not requests found
    if (cursorReq == null) {
      return 0;
    }
    return cursorReq.value.id;
  }
}
