import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  userform!:FormGroup;
  records:User[]=[];
  searchbyemail:string=''
  founddata:User | null=null
  constructor(private service:UserService,private fb:FormBuilder){
    
  }
  ininit():void{
    this.userform=this.fb.group({
      id:[null],
      name:['',[Validators.required,Validators.minLength(5),Validators.maxLength(10)]],
      email:['',[Validators.required,Validators.email]],
      password:['',Validators.required,Validators.minLength(5),Validators.maxLength(10)]   
    })

  }
  ngOnInit():void{
    this.getalldata();
    this.ininit();
  }
  getalldata():void{
    this.service.onfetch().subscribe(data=> this.records=data);
  }
  postdata():void{
    const posting:User={...this.userform.value,id:this.getting()};
    this.service.onadd(posting).subscribe(()=>{
      this.getalldata()
    })
  }
  getting():number{
    return this.records.length>0?Math.max(...this.records.map((record)=>record.id ||0))+1:1;
  }
  deleteuser(id:number| undefined):void{
    if(id!==undefined)
    this.service.ondelete(id).subscribe(()=>{
  this.getalldata()
})
  }
  updateuser():void{
    const id=this.userform.value.id;
    const updaterecord:User={...this.userform.value};
    this.service.onupdate(id,updaterecord).subscribe(()=>{
      this.getalldata()
    })
  }
}
