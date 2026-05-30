import { Component, inject, OnInit } from '@angular/core';
import { BerkeService } from '../shared/services/berke.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BerkeComponent } from '../berke/berke.component';

@Component({
  selector: 'app-verify',
  imports: [],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent implements OnInit {

  private router = inject(Router)
  private berkeService = inject(BerkeService)
  private route = inject(ActivatedRoute);
  ngOnInit(): void {
    const authority = this.route.snapshot.queryParamMap.get('Authority')
    if (authority) {
    this.berkeService.verify(authority).subscribe(res =>{
      if (res === true){
        this.isVerified()
      } else {
        this.notVerified()
      }
    })
    } else {
      this.notVerified()
    }
  }

  isVerified(){
    this.router.navigate(['/profile'])
  }

  notVerified(){
        this.router.navigate(['/subscription'])
  }
}
