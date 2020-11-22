# medicar-intmed
Desafio técnico do IntMed

## Como rodar sua aplicação com docker

### Iniciando aplicação

*Obs: Para executar o projeto com os comandos a seguir é necessário ter o `docker` e `docker-compose` instalados no seu ambiente.*

```shell
docker-compose up -d
```

### Migração

```shell
docker exec medicar-intmed_back_1 python manage.py migrate --noinput
```

### Criando um super usuário de administração do django-admin

```shell
docker exec -it medicar-intmed_back_1 /bin/bash
python manage.py createsuperuser
```
