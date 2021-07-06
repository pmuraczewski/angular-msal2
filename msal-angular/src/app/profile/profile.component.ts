import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

const GRAPH_ENDPOINT = 'https:graph.microsoft.com/v1.0/me';

type ProfileType = {
  givenName?: string,
  surname?: string,
  userPrincipalName?: string,
  id?: string
};

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile!: ProfileType;

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile() {
    this.httpClient.get(GRAPH_ENDPOINT)
        .subscribe(profile => {
          this.profile = profile;
        });
  }
}
