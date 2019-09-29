// import * as Yup from 'yup';

import User from '../models/User';
import File from '../models/File';

class ProviderController {
  async index(req, res) {
    // const schema = Yup.object().shape({
    //   name: Yup.string(),
    //   email: Yup.string().email(),
    //   oldPassword: Yup.string().min(6),
    //   password: Yup.string()
    //     .min(6)
    //     .when('oldPassword', (oldPassword, field) =>
    //       oldPassword ? field.required() : field
    //     ),
    //   confirmPassword: Yup.string().when('password', (password, field) =>
    //     password ? field.required().oneOf([Yup.ref('password')]) : field
    //   ),
    // });

    const providers = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(providers);
  }
}

export default new ProviderController();
