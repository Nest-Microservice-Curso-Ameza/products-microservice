
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';


@Catch(RpcException)
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    return throwError(() => exception.getError());
  }
}

