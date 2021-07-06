import { Component, Inject, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { InteractionStatus, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'msal-angular';
  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig, private broadcaseService: MsalBroadcastService, private authService: MsalService) { }

  ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener;

    this.broadcaseService.inProgress$
        .pipe(
          filter((status: InteractionStatus) => status == InteractionStatus.None),
          takeUntil(this._destroying$)
        )
        .subscribe(() => {
          this.setLoginDisplay();
        })
  }

  login() {
    if(this.msalGuardConfig.authRequest){
      this.authService.loginPopup({...this.msalGuardConfig.authRequest} as PopupRequest)
          .subscribe({
            next: (result) => {
              console.log(result);
              this.setLoginDisplay()
            },
            error: (error) => console.log(error)
          });
    } else {
      this.authService.loginPopup()
          .subscribe({
            next: (result) => {
              console.log(result);
              this.setLoginDisplay();
            },
            error: (error) => console.log(error)
          })
      this.authService.loginRedirect();
    }
  }

  logout() {
    this.authService.logoutPopup({
      mainWindowRedirectUri: "/"
    });
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
