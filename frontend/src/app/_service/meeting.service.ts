import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Observable } from "rxjs/internal/Observable";
import { User } from "../_model/user";
import { HttpClient } from "@angular/common/http";
import { Meeting } from "../_model/meeting";

@Injectable({
  providedIn: "root"
})
export class MeetingService {
  meeting_url = "http://localhost:3000/api/meeting/meetings";
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  addNewMeeting(title: string, when: Date) {
    return this.http.post<any>(this.meeting_url, { title, when });
  }

  updateMeeting(meeting: Meeting) {
    return this.http.put<any>(this.meeting_url, meeting);
  }

  getMyMeetings() {
    return this.http.get<any>(this.meeting_url);
  }

  deleteMeeting(meeting: Meeting): Observable<Meeting> {
    const id = meeting._id;
    const url = `${this.meeting_url}/${id}`;
    console.log(url);
    return this.http.delete<any>(url);
  }
}
