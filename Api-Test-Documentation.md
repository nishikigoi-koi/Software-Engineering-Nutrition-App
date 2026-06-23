# Postman Api Test Documentation

This document summarizes the flow testing through [Postman](https://www.postman.com/api-platform/api-testing/) 

(I can't upload the flow it's self, but the test collection is Tests.postman_collection.json which can be imported into postman)

tests are only with expected values

most api function use variables e.g. {{username}}

all api function have a Authoriztion header unless specified 
<img width="693" height="76" alt="image" src="https://github.com/user-attachments/assets/f03c3dfa-833e-4b8e-8495-c98cbdabee3b" />

## user

### create
<img width="651" height="229" alt="image" src="https://github.com/user-attachments/assets/0c65df91-f93e-4815-8f16-aa39b2eb998b" />

- no auth needed

### update  
<img width="645" height="232" alt="image" src="https://github.com/user-attachments/assets/f4fc67a0-c7df-407a-9e7d-7f04f8ee7cab" />

### delete 
<img width="470" height="79" alt="image" src="https://github.com/user-attachments/assets/a20667ed-70b5-43fa-8dd6-fa143eeeceb1" />

### get by id 
<img width="444" height="79" alt="image" src="https://github.com/user-attachments/assets/6f5f0d74-627c-4e15-8745-c6d138ccceef" />

### get all users 
<img width="390" height="81" alt="image" src="https://github.com/user-attachments/assets/9ce3ef1f-8dcb-4f27-bf45-f8ee00263dc1" />

### check user password 
<img width="643" height="224" alt="image" src="https://github.com/user-attachments/assets/5f2ed154-471b-4dcd-8720-72658d116033" />
<img width="1399" height="472" alt="image" src="https://github.com/user-attachments/assets/6b21e1f0-d790-49fe-86ff-b35c90aa530f" />

- no auth needed

## patient
<img width="1846" height="771" alt="image" src="https://github.com/user-attachments/assets/7cfa9f5f-e6e4-461e-8aa5-923234a41550" />

### create 
<img width="636" height="351" alt="image" src="https://github.com/user-attachments/assets/a3c09bed-0606-4aa1-b184-4a832ab1eb7c" />

### update
<img width="643" height="333" alt="image" src="https://github.com/user-attachments/assets/3c071287-d238-4d67-8a68-2121a4c57231" />

### delete
<img width="493" height="77" alt="image" src="https://github.com/user-attachments/assets/12a844d7-0fe3-4d26-b6fa-c38f3dd8ae30" />

### get by id 
<img width="445" height="82" alt="image" src="https://github.com/user-attachments/assets/5d97c027-51f6-4c2b-bd5a-88c06b72aa64" />

### get all for a user
<img width="487" height="76" alt="image" src="https://github.com/user-attachments/assets/fd53485e-3de1-4a52-8c32-c72f29ec5a98" />


## dietary restrictions
<img width="1857" height="779" alt="image" src="https://github.com/user-attachments/assets/1e307198-5763-4131-a582-cdd55ccd2a16" />
<img width="1331" height="641" alt="image" src="https://github.com/user-attachments/assets/d6cefd47-3f9e-422c-b6d1-f5d00913522b" />

### create
<img width="620" height="231" alt="image" src="https://github.com/user-attachments/assets/18894207-76c8-4680-8d7a-794462a32715" />

### update
<img width="610" height="224" alt="image" src="https://github.com/user-attachments/assets/a48ec904-b021-4062-b302-1dafe6ca5480" />

### delete
<img width="589" height="76" alt="image" src="https://github.com/user-attachments/assets/8c9c9de9-becf-4fa8-8852-a0480a435168" />

### get by id 
<img width="486" height="79" alt="image" src="https://github.com/user-attachments/assets/6743915c-1f04-4347-8f93-9400e4a10ca8" />
- no auth needed

### get all
<img width="539" height="78" alt="image" src="https://github.com/user-attachments/assets/d750a1fc-9e0e-4fb8-94b1-4a8df2a1c77f" />

- no auth needed

### assign to patient
<img width="639" height="238" alt="image" src="https://github.com/user-attachments/assets/226a89f9-2d71-492f-83b9-db21216a59e2" />

### remove from patient
<img width="622" height="226" alt="image" src="https://github.com/user-attachments/assets/68bb9a84-5645-4981-ad48-8063cb30e09b" />

### get all for patient
<img width="594" height="79" alt="image" src="https://github.com/user-attachments/assets/dd89cb36-9ea0-40b3-912d-f8818a591d1e" />


## medical condition
<img width="1859" height="771" alt="image" src="https://github.com/user-attachments/assets/a9424a9c-cede-4ea5-8ced-95b33ed41272" />
<img width="1335" height="638" alt="image" src="https://github.com/user-attachments/assets/aef1c7a9-ca01-4e6f-9080-8abbd6f0d0eb" />

### create
<img width="710" height="224" alt="image" src="https://github.com/user-attachments/assets/55c16771-6202-4983-8508-df5988adcdd9" />

### update
<img width="750" height="220" alt="image" src="https://github.com/user-attachments/assets/49d0231f-eee5-4e75-ae51-30365f266f3f" />

### delete
<img width="591" height="76" alt="image" src="https://github.com/user-attachments/assets/a80d43aa-ad92-4db6-87da-a770f55ec0b9" />

### get by id 
<img width="481" height="74" alt="image" src="https://github.com/user-attachments/assets/83479c2b-2325-40c6-9a96-398c0c37a59c" />
- no auth needed

### get all
<img width="517" height="73" alt="image" src="https://github.com/user-attachments/assets/6d8102ca-6873-470b-9814-41888e3c6f51" />

- no auth needed

### assign to patient
<img width="627" height="237" alt="image" src="https://github.com/user-attachments/assets/93d35203-f9db-447f-9ad0-60293031519f" />

### remove from patient
<img width="626" height="199" alt="image" src="https://github.com/user-attachments/assets/4a79143e-7d31-4a79-ae76-8b91f6764c53" />

### get all for patient
<img width="589" height="79" alt="image" src="https://github.com/user-attachments/assets/5703a990-f483-4a62-8274-f9a00ad2ac42" />


## CustomFood
<img width="1872" height="781" alt="image" src="https://github.com/user-attachments/assets/b28d6e4a-efd6-4633-a93f-29dd53ab3d90" />

### create
<img width="944" height="855" alt="image" src="https://github.com/user-attachments/assets/b6e7c384-7793-487d-a4b3-691541a37cd2" />
<img width="367" height="525" alt="image" src="https://github.com/user-attachments/assets/b58586c9-bdbf-4cbd-a722-0b3c3395205d" />

### update
<img width="952" height="851" alt="image" src="https://github.com/user-attachments/assets/f2c70c29-6943-4b67-a0be-545736db6d41" />
<img width="366" height="523" alt="image" src="https://github.com/user-attachments/assets/a375cb76-634b-4af2-9884-fefa4e1111f1" />


### delete
<img width="468" height="76" alt="image" src="https://github.com/user-attachments/assets/f7d58de4-ed90-4b4e-9787-994442cc8adc" />

### get by id 
<img width="425" height="76" alt="image" src="https://github.com/user-attachments/assets/abc7b127-e363-401d-a28e-18adea5d9a97" />

### get all by user 
<img width="504" height="80" alt="image" src="https://github.com/user-attachments/assets/95a000bc-81c7-45cc-9ce3-9402c63bdcb2" />


## Food log
<img width="1912" height="375" alt="image" src="https://github.com/user-attachments/assets/6a5f5371-e594-4ff7-9236-2be8a3d453e1" />
<img width="1917" height="630" alt="image" src="https://github.com/user-attachments/assets/3a020100-1a6f-43a0-b603-815713bfc98a" />

### create
<img width="635" height="314" alt="image" src="https://github.com/user-attachments/assets/259db095-ba07-4556-bf30-c4da2de0d815" />

### update
<img width="591" height="307" alt="image" src="https://github.com/user-attachments/assets/a8a88df9-2859-458c-a70c-bdc7a3aa7a77" />

### delete
<img width="379" height="78" alt="image" src="https://github.com/user-attachments/assets/3a874b98-c04a-4129-a78b-278b55930058" />

### get by id 
<img width="354" height="67" alt="image" src="https://github.com/user-attachments/assets/72d8dab8-bef9-4186-a7d2-cdf7e14bcbc6" />

### get all by patient
<img width="449" height="74" alt="image" src="https://github.com/user-attachments/assets/9eed1205-70a9-44ee-b157-95380026bb81" />

### gat all for date and patient 
<img width="645" height="76" alt="image" src="https://github.com/user-attachments/assets/00001bc4-ba55-4657-85d6-7ffc7598e9a5" />


## search
<img width="1322" height="810" alt="image" src="https://github.com/user-attachments/assets/0fc5349e-3ec1-4e08-8069-9524611919a2" />

### for food 
<img width="586" height="76" alt="image" src="https://github.com/user-attachments/assets/9fdc16c7-789b-40d7-98ab-b0018b9d32ea" />

### get by custom food 
<img width="456" height="76" alt="image" src="https://github.com/user-attachments/assets/c571f2d4-0275-4b04-9e57-0e0f8f0c5f7b" />

### get by food file
<img width="433" height="76" alt="image" src="https://github.com/user-attachments/assets/110990d2-c62f-4d27-821c-4263e514bdae" />

- no auth needed

## RDI

### calculate
<img width="333" height="73" alt="image" src="https://github.com/user-attachments/assets/330378b6-f656-4b54-900c-fbb3926cd273" />
<img width="611" height="364" alt="image" src="https://github.com/user-attachments/assets/d6dcea03-9428-4fc5-9f55-27bb45a378c7" />


## total nutrients

### get for day
<img width="608" height="74" alt="image" src="https://github.com/user-attachments/assets/634d850d-e16b-4e04-80c5-0785ba19df15" />
<img width="608" height="386" alt="image" src="https://github.com/user-attachments/assets/aefe31b5-9b05-462b-8487-9dae3ba9f46c" />


### get for week
<img width="652" height="78" alt="image" src="https://github.com/user-attachments/assets/b3ccda1b-e691-42a3-be02-a6f061958adc" />
<img width="599" height="349" alt="image" src="https://github.com/user-attachments/assets/12c94d7e-5ac8-40b5-ae3c-4fa0ff479e42" />


### get for custom time period
<img width="853" height="72" alt="image" src="https://github.com/user-attachments/assets/1df71bea-0773-4732-820a-c5914bdf529b" />
<img width="597" height="377" alt="image" src="https://github.com/user-attachments/assets/09d061b9-dd6d-496d-9010-5bc71204962f" />


## flag

### get for day
<img width="560" height="80" alt="image" src="https://github.com/user-attachments/assets/b83e649c-aeb5-4da8-8cd6-028e506230d9" />
<img width="611" height="373" alt="image" src="https://github.com/user-attachments/assets/ed0b1e26-2e5f-4a07-b94b-7dbea6662e3e" />


### get for week
<img width="594" height="77" alt="image" src="https://github.com/user-attachments/assets/40571815-e251-425c-92c7-0bd1c736cfbc" />
<img width="641" height="403" alt="image" src="https://github.com/user-attachments/assets/228c786c-50fe-454c-b0ad-1a9f4d6e87ec" />


### get for custom time period
<img width="744" height="77" alt="image" src="https://github.com/user-attachments/assets/0d98ca95-2399-43fe-b734-aed3cf7112e3" />
<img width="628" height="432" alt="image" src="https://github.com/user-attachments/assets/0a2fd72f-bdd8-4c5d-81a1-a143294efa68" />


## report

### get for day
<img width="575" height="78" alt="image" src="https://github.com/user-attachments/assets/2a2857c3-d5fc-42d1-86ed-32167b2e3371" />
<img width="635" height="416" alt="image" src="https://github.com/user-attachments/assets/00fef989-3a93-4939-83a8-fa2c1e8b2545" />


### get for week
<img width="606" height="78" alt="image" src="https://github.com/user-attachments/assets/7948b89e-c0b4-47e9-8596-75589402d63a" />
<img width="606" height="401" alt="image" src="https://github.com/user-attachments/assets/4b64428c-2611-43eb-a0c7-0266e0380203" />


### get for custom time period
<img width="822" height="78" alt="image" src="https://github.com/user-attachments/assets/1dba39d1-73f2-4d3e-b6ec-cde35476821c" />
<img width="617" height="385" alt="image" src="https://github.com/user-attachments/assets/d0e892b7-2793-497f-81a1-26c0a16d10cb" />


