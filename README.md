**Sequelize query string parser for nest.js**

_parse incoming query string to valid sequelize options:_

**examples:**

1.  **limit and offset:** `?limit=1&&offset=2`
2.  **ordering** `?order=name,age?DESC` conveted to

```json
{
 order:[[name,age], DESC]
}
```

3.  **Where Options** `?filter=age.gt.2^name.contains.test` converted to

```json
{
 age: {
 [Op.gt]:2
 },
 name:{
  [Op.contains]:'test'
 }
}
```
