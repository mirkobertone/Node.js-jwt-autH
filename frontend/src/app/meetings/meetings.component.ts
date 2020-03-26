import { Component, OnInit, Inject, Input } from "@angular/core";
import { MeetingService } from "../_service/meeting.service";
import { Meeting } from "../_model/meeting";
import { MEETINGS } from "../mock_meetings";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog
} from "@angular/material/dialog";

@Component({
  selector: "app-meetings",
  templateUrl: "./meetings.component.html",
  styleUrls: ["./meetings.component.css"]
})
export class MeetingsComponent implements OnInit {
  meetings: Meeting[];
  selectedMeeting: Meeting;

  newMeeting: Meeting;
  title: "";
  when: Date;

  constructor(
    private meetingService: MeetingService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getMeetings();
  }

  onSelect(hero: Meeting): void {
    this.selectedMeeting = hero;
  }

  addNewMeeting(result) {
    console.log("New Meeting!");
    console.log(result);
    this.title = "";
    this.when = null;
    if (!result.title || result.date === null) return;
    this.title = result.title.trim();
    this.when = result.date as Date;
    console.log(this.title + this.when);
    this.meetingService
      .addNewMeeting(this.title, this.when)
      .subscribe(meeting => {
        this.meetings.push(meeting);
        console.log("SALVATO:");
        console.log(meeting);
      });
  }

  getMeetings(): void {
    this.meetingService
      .getMyMeetings()
      .subscribe(meetings => (this.meetings = meetings as Meeting[]));
  }

  editMeeting(meeting: Meeting) {
    console.log(meeting);
    this.meetingService.updateMeeting(meeting).subscribe(meetingo => {
      const index = this.meetings.indexOf(meeting);
      //this.meetings = this.meetings.filter(h => h !== meeting);
      this.meetings[index] = meetingo;
    });
  }
  deleteMeeting(meeting: Meeting): void {
    this.meetings = this.meetings.filter(h => h !== meeting);
    this.meetingService.deleteMeeting(meeting).subscribe();
  }

  openAddNewMeetingDialog(): void {
    const dialogRef = this.dialog.open(DialogAddNewMeeting, {
      width: "auto",
      height: "auto",
      data: { title: "", date: "" }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) return;
      this.addNewMeeting(result);
    });
  }

  openEditMeetingDialog(meeting: Meeting): void {
    const dialogRef = this.dialog.open(DialogEditMeeting, {
      width: "auto",
      height: "auto",
      data: { meeting }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (!result) return;
      this.editMeeting(result.meeting);
    });
  }
}

@Component({
  selector: "dialog-add-new-meeting-dialog",
  templateUrl: "dialog-add-new-meeting-dialog.html"
})
export class DialogAddNewMeeting {
  constructor(
    public dialogRef: MatDialogRef<DialogAddNewMeeting>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  onNoClick(): void {
    this.dialogRef.close();
  }
  save(): void {
    console.log(this.data);
    this.dialogRef.close(this.data);
  }
}

@Component({
  selector: "dialog-edit-meeting-dialog",
  templateUrl: "dialog-edit-meeting-dialog.html"
})
export class DialogEditMeeting {
  constructor(
    public dialogRef: MatDialogRef<DialogEditMeeting>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    console.log(d.getTime());
    const today = new Date().getTime();

    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  onNoClick(): void {
    this.dialogRef.close();
  }
  save(): void {
    console.log(this.data);
    this.dialogRef.close(this.data);
  }
}
