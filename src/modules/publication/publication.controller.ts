import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Headers,
} from '@nestjs/common';
import { PublicationService } from './publication.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtService } from '@nestjs/jwt';
import { Public } from 'src/decorators/is-public.decorator';
import { Role } from 'src/enum/role.enum';
import { Roles } from 'src/decorators/role.decorator';
import { createCategoryDto } from './dto/create-category.dto';

@ApiTags('publication')
@Controller('publication')
export class PublicationController {
  constructor(
    private readonly publicationService: PublicationService,
    private jwtService: JwtService,
  ) {}

  @Get()
  @Public()
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findPrublications(
    @Query('category') category?: string,
    @Query('city') city?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    return this.publicationService.findPrublications(
      category,
      city,
      page,
      limit,
    );
  }
  @Get('all')
  async findAllId(@Headers() header, id: string) {
    const secret = process.env.JWT_SECRET;
    const { userid } = this.jwtService.verify(header.authorization, { secret });
    return await this.publicationService.findAllId(userid);
  }

  @Public()
  @Get('category')
  findAllCategories() {
    return this.publicationService.findAllCategories();
  }

  @Public()
  @Get('allPublications')
  findAllPublications() {
    return this.publicationService.findAllPublications();
  }

  @Public()
  @Get('premium')
  findAllPremium() {
    return this.publicationService.findAllPremium();
  }

  @Public()
  @Get(':id')
  findOnePublication(@Param('id') id: string) {
    return this.publicationService.findOnePublication(id);
  }
  @Post('category')
  // @Roles(Role.ADMIN)
  async createCategory(@Body() category: createCategoryDto) {
    console.log(`estamos en controller post publication `);
    console.dir(category);

    return await this.publicationService.createCategory(category);
  }
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createPublicationDto: CreatePublicationDto,
    @Headers() header,
    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    const secret = process.env.JWT_SECRET;
    const { userid } = this.jwtService.verify(header.authorization, { secret });
    return this.publicationService.create(createPublicationDto, file, userid);
  }

  //! SI USAN ESLINT Y PRETTIER COMO DEBERIA SER, ESTO TIRABA ERRORES Y POR ESO
  //! LO BAJE ACÁ PARA PODER MERGEAR , PERO:
  //! 1) NO DEBERIA ESTAR COMENTADO
  //! 2) DEBERIA ESTAR FORMATEADO Y CORREJIDO TODO LOS ERRORES ANTES DE HACER MERGE
  //! 3) TENGO LOS HUEVOS INCHADOS DE HACER ESTO CADA VEZ QUE TENGO PROBLEMAS PARA MERGEAR
  //! 4) POR ULTIMO, DESCARGUEN LA EXTENSION DE BETTER COMENTS , ASI LEEN ESTO CADA VEZ Q PASEN POR ACA
  // new ParseFilePipe({
  //   validators: [
  //     new MaxFileSizeValidator({
  //       maxSize: 200000,
  //       message: 'El archivo es demasiado grande',
  //     }),
  //     new FileTypeValidator({
  //       fileType: /(jpg|jpeg|png|svg|webp)/,
  //     }),
  //   ],
  // }),

  @Post('listMe/:id')
  listMe(@Param('id') id: string, @Headers() header) {
    const secret = process.env.JWT_SECRET;
    const { userid } = this.jwtService.verify(header.authorization, { secret });
    return this.publicationService.listMe(id, userid);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePublicationDto: UpdatePublicationDto,
  ) {
    return await this.publicationService.update(id, updatePublicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publicationService.remove(id);
  }
}
