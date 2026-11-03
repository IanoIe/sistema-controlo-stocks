
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { UserCollection, UserModel, RegisterModel } from "../models/user";

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

  // REGISTER
  register(data: RegisterModel): Observable<UserModel> {
    return this.http.post<UserModel>(this.apiUrl, data);
  }

  // GET USERS
  getUsers(): Observable<UserModel[]> {
    return this.http.get<UserCollection>(this.apiUrl).pipe(
      map(response => response.member)
    );
  }

  // GET CURRENT USER
  getMe(): Observable<UserModel> {
    return this.http.get<UserModel>(
      `${environment.apiUrl}/me`
    );
  }

  // UPDATE CURRENT USER
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

  // DELETE USER
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}
