import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { LogActivity, LogActivityDocument } from 'src/schemas/logActivity';

@Injectable()
export class LogService {
  constructor(
    // @InjectModel(LogActivity.name)
    // private readonly logActivityModel: Model<LogActivityDocument>, // ✅ Inject here
  ) {}

  async saveLog(user: any, body: any) {
    try {
      body.createdUserId = user._id
    //   await this.logActivityModel.create(body);
    } catch (error) {
      console.log('---Error -> log-activity -> saveLog---', error);
      throw error
    }
  }
}