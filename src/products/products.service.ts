import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';

import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto } from 'src/common';
import { PrismaClient } from '@prisma/client';
import { UpdateProductDto } from './dto/update-product.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  

  private readonly logger = new Logger('ProductsService')

  async onModuleInit() {
    await this.$connect();
    this.logger.log('database conecte products')
  } 

  create(createProductDto: CreateProductDto) {


    
    try {

      return this.product.create({
        data: createProductDto
      });
      
    } catch (error) {
      
      throw new RpcException({
        codeStatus: HttpStatus.BAD_REQUEST, 
        message: error
      })

    }
    
  }

  async findAll( paginationDto: PaginationDto ) {

    const { skip, page, limit } = paginationDto;

    const totalPges = await this.product.count();
    const lastPage  = Math.ceil( totalPges / limit );

    return {
       data: await this.product.findMany({
        skip: skip,
        take: limit,
        where: { available: true }
      }),
      meta: {
         total: totalPges,
         page: page,
         lastPage: lastPage
      }
    }
  }

  async findOne(id: number) {


     try {


        const product = await this.product.findFirst({ 
          where: { id: id } 
        })
  
        if (!product) {
  
          
        }
  
        return product
      
     } catch (error) {
      
        throw new RpcException({
          codeStatus: HttpStatus.BAD_REQUEST,
          message:`Not found product with id ${id} `}
        )

     }
   
     
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const { id: _, ...data } = updateProductDto;

    await this.findOne(id);

    return this.product.update({
        where: { id: id },
        data: data
    });

  }

  async remove(id: number) {
    
    await this.findOne(id);

    return await this.product.update({ 
      where: { id: id },
      data: {
         available: false
      }
    });




  }




  async validateProducts(ids: number[]) {
    ids = Array.from(new Set(ids));

    const products = await this.product.findMany({
      where: {
        id: {
          in: ids
        }
      }
    });

    if ( products.length !== ids.length ) {
      throw new RpcException({
        message: 'Some products were not found',
        status: HttpStatus.BAD_REQUEST,
      });
    }


    return products;

  }

  
}
