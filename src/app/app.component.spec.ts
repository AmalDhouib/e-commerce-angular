import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { AppComponent } from './app.component';

@Component({
  selector: 'app-header',
  template: '',
  standalone: true,
})
class HeaderStubComponent {
  @Input() title: string = '';
};
