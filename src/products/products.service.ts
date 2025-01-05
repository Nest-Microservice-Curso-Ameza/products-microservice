


import { PrismaClient } from '@prisma/client';
   
  
import { UpdateProductDto } from './dto/update-product.dto';

import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto } from 'src/common';
import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';


@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  

  private readonly logger = new Logger('ProductsService')

  async onModuleInit() {
    await this.$connect();
    this.logger.log('database conecte products')
  } 

  create(createProductDto: CreateProductDto) {


    return this.product.create({
      data: createProductDto
    });
    
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
   
     const product = await this.product.findFirst({ 
       where: { id: id } 
     })

     if (!product) {
        throw new NotFoundException(`Not found product with id ${id} `)
     }

     return product
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
}