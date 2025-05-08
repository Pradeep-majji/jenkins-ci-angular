import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeService, PinUpdateRequest } from './employee.service';
import { Employee, Role } from '../models/employee.interface';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8081/crudapi';

  const mockRole: Role = {
    roleId: 1,
    roleName: 'Staff',
    level: 1,
    createDate: '2024-01-01',
    createBy: 1,
    updateDate: '2024-01-01',
    updateBy: 1,
    isActive: true
  };

  const mockEmployee: Employee = {
    empId: 1,
    empFirstName: 'John',
    empMiddleName: 'D',
    empLastName: 'Doe',
    empEmail: 'john.doe@example.com',
    pin: '1234',
    role: mockRole,
    createDate: '2024-01-01',
    createBy: 1,
    updateDate: '2024-01-01',
    updateBy: 1,
    isActive: true
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployeeService]
    });
    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get employee by ID', () => {
    service.getEmployeeById(1).subscribe(employee => {
      expect(employee).toEqual(mockEmployee);
    });

    const req = httpMock.expectOne(`${apiUrl}/employees/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployee);
  });

  it('should get all employees', () => {
    const mockEmployees: Employee[] = [
      mockEmployee,
      {
        ...mockEmployee,
        empId: 2,
        empFirstName: 'Jane',
        empMiddleName: 'M',
        empLastName: 'Smith',
        empEmail: 'jane.smith@example.com',
        pin: '5678',
        role: {
          ...mockRole,
          level: 2,
          roleName: 'Manager'
        }
      }
    ];

    service.getAllEmployees().subscribe(employees => {
      expect(employees.length).toBe(2);
      expect(employees).toEqual(mockEmployees);
    });

    const req = httpMock.expectOne(`${apiUrl}/employees`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployees);
  });

  it('should update PIN', () => {
    const updateRequest: PinUpdateRequest = {
      empId: 1,
      empPin: '1234',
      managerId: 2,
      managerPin: '5678'
    };

    const mockResponse = { message: 'PIN updated successfully' };

    service.updatePin(updateRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/employees/update-pin`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateRequest);
    req.flush(mockResponse);
  });

  it('should handle error when updating PIN', () => {
    const updateRequest: PinUpdateRequest = {
      empId: 1,
      empPin: '1234',
      managerId: 2,
      managerPin: '5678'
    };

    service.updatePin(updateRequest).subscribe({
      error: (error) => {
        expect(error.status).toBe(403);
      }
    });

    const req = httpMock.expectOne(`${apiUrl}/employees/update-pin`);
    req.flush('Unauthorized', { status: 403, statusText: 'Forbidden' });
  });
});
