export class Assignment {
  constructor(id, title, description, duedate, status) {
    if (id) {
      this.id = id;
    }
    this.title = title;
    this.description = description;
    this.duedate = duedate;
    this.status = status;
  }

  getID() {
    return this.id;
  }
  getTitle() {
    return this.title;
  }
  getDescription() {
    return this.description;
  }
  getDueDate() {
    return this.duedate;
  }
  getStatus() {
    return this.status;
  }

  setID(id) {
    this.id = id;
  }
  setTitle(title) {
    this.title = title;
  }
  setDescription(description) {
    this.description = description;
  }
  setDueDate(duedate) {
    this.dueDate = duedate;
  }
  setStatus(status) {
    this.status = status;
  }
}
