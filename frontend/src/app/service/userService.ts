import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { UserCollection, UserModel } from "../models/user";

interface UpdateMeResponse {
  success: boolean;
  message: string;
  user: UserModel;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserModel[]> {
    return this.http.get<UserCollection>(this.apiUrl).pipe(
      map(response => response.member)
    );
  }

  getMe(): Observable<UserModel> {
    return this.http.get<UserModel>(
      `${environment.apiUrl}/me`
    );
  }

  updateMe(data: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }): Observable<UserModel> {

    return this.http.put<UpdateMeResponse>(
      `${environment.apiUrl}/me`,
      data
    ).pipe(
      map(response => response.user)
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}
