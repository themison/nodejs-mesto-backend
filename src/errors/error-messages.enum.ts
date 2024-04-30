// eslint-disable-next-line no-shadow
enum ErrorMessages {
  NOT_AUTH = 'Пользователь не авторизован',
  BAD_AUTH = 'Передан неверный логин или пароль.',
  WRONG_DATA =
    'Переданы некорректные данные в метод',
  NOT_ALLOWED_DEL_CARD = 'Совершена попытка удалить чужую карточку',
  NOT_FOUND =
    'Карточка или пользователь не найден или был запрошен несуществующий адрес',
  EMAIL_EXIST = 'Пользователь с данным email уже существует на сервере',
  SERVER_ERROR = 'На сервере произошла ошибка',
}

export default ErrorMessages;
