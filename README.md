# **Caterpillar**

**Frontend application** for **Caterpillar**. Caterpillar is a BPMN execution engine on Ethereum. Caterpillar is a Business Process Management System (BPMS) prototype that runs on top of Ethereum and that relies on the translation of process models into smart contracts. 

For more information about Caterpillar, you can visit its GitHub Repository: [Caterpillar](https://github.com/orlenyslp/Caterpillar)

## Technologies used

> JavaScript ES6, React.js Library, React+Bootstrap, React+Redux, WebSockets, Camunda Plugin.


## Installation

- Download or clone this repository to your local machine: 
```
git clone https://github.com/mirlindm/caterpillar-core-frontend.git
``` 
- Open it in your preferred code editor 
- Navigate to the CATERPILLAR_CORE_FRONTEND folder
- For installing the dependencies, run the command: 
```
npm install
``` 
- For starting the server, run the command: 
```
npm start
``` 
- You will be redirected to the browser, but nevertheless, you might as well navigate to: localhost:4000


## About the Application

There are numerous React components created to communicate and consume the **REST APIs** exhibited by the backend **Caterpillar**. 

- The **RuntimeRegistry Component** under the **Registry Directory** is used to create new **Runtime Registries** or load existing ones. The **Runtime Registry Address** is then exported to the **Redux Store**, since it is needed throughout the entire lifecycle of the application. 
- The **BPMN Directory** has several other crucial components, namely the: 
  - **CompilationEngine Component** - which allows to query the deployed and compiled Process Models from the database.
  - **InterpretationEngine** - which allows to create a new interpreter, deploy Process Models using the Interpretation Engine.
  - **ProcessInstanceOperations Component** - allows to create new Process Cases or Process Instances, fetch existing Process Cases and query the Process Cases' states.
  - **NB**: In order to create a new **Process Case**, we need to define the policies related to it. More information about the policies is listed below in the **Policies Directory (AccessControl Component)**. 

- Moreover, under the **BPMN Directory**, there are two sub-directories:
 
  - **Compilation Directory**: includes the required components (**CCreateiagram.js and CUploadDiagram.js**) that make possible to create Process Models or upload existing ones. Also, through these components, we can deploy and compile Process Models using the Compilation Engine. This is done by integrating the **Camunda Plugin** within these components. 
  - **Interpretation Directory**: includes the required components (**ICreateiagram.js and IUploadDiagram.js**) that make possible to create Process Models or upload existing ones and deploy them using the Interpretation Engine. This is done by integrating the **Camunda Plugin** within these components. 
  
- Another crucial directory for the application is the **Policies** folder, where we can find the following components:
 
  - **AccessAllocation Component**: allows us to perform several operations/requests, such as:   
     - Querying information about the **deployed policies**
     - **Querying the state of the roles** defined in the role-binding policy.
     - **Nominating** the creator of the case or instance
     - **Nominating** other roles/actors as defined in the role-binding policy.
     - **Releasing** a specific role as defined in the role-binding policy.
     - **Voting** or endorsing roles as defined in the policies.

   - **AccessControl Component**: allows us to define (create or load) the policies regarding the execution process of the Process Cases, such as:
     - **Access Control Policies**: we can create a new Access Control Policy or load the metadata of an existing one from the database. Note that when a new Access Control Policy is created, the Frontend Application connects to the web socket defined by Caterpillar in the Backend, and automatically displays the Access Control Address and loads the information about the policy. Later, this address is stored in the Redux Store, in order to be later used for the creation of new Process Instances/Cases.
     - **Role-Binding Policy**: we can create a new Role-Binding Policy or load an existing one from the database. The creation of a new Role-Binding Policy is possible if we provide a textual description of a Role-Binding Policy. Note that when a new Role-Binding Policy is created, the Frontend Application connects to the web socket defined by Caterpillar in the Backend, and automatically displays the Role-Binding Policy Address and loads the information about the policy. Later, this address is stored in the Redux Store, in order to be later used for the creation of new Process Instances/Cases.  
     - **Task-Role Map Policy**: we can create a new Task-Role Map Policy or load an existing one from the database. We can provide this policy in a textual field as a textual description of a map of tasks and roles. Note that when a new Role-Binding Policy is created, the Frontend Application connects to the web socket defined by Caterpillar in the Backend, and automatically displays the Role-Binding Policy Address and loads the information about the policy. Later, this address is stored in the Redux Store, in order to be later used for the creation of new Process Instances/Cases. 
     
- There are other components that are used for designing the application, such as: 
   - **Welcome Component** under the **Welcome Directory**: for styling the Home Page.
   - **About Component** under the A**bout Directory**: for providing more information about Caterpillar.
   - **NavigationBar Component** and the **Footer Component** for defining the menu and the footer of **Caterpillar Frontend**. 


- Lastly, there are other components that are used for other purposes: 
   - **Reducers Directory** and **Actions Directory** are used for the purposes of Redux: dispatching Redux functions to the Reducer. 
   - **Error Component** under the **Error Directory**: for handling incorrect endpoints on the Frontend.

## Frontend Caterpillar Screenshots

![Alt text](/relative/path/to/img.jpg?raw=true "Optional Title")


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Contact
@: mirlindmurati777@gmail.com
