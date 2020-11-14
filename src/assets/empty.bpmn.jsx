export const basic_example = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_0ncawtr" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="4.2.0">
  <bpmn:process id="Process_1yn2e1y" name="basic_example" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" name="e1">
      <bpmn:outgoing>Flow_1y3v0pn</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:sequenceFlow id="Flow_1y3v0pn" sourceRef="StartEvent_1" targetRef="Activity_0fto51j" />
    <bpmn:userTask id="Activity_0fto51j" name="A">
      <bpmn:incoming>Flow_1y3v0pn</bpmn:incoming>
      <bpmn:outgoing>Flow_0snq7p2</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:endEvent id="Event_1hro3k1" name="e2">
      <bpmn:incoming>Flow_0snq7p2</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_0snq7p2" sourceRef="Activity_0fto51j" targetRef="Event_1hro3k1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1yn2e1y">
      <bpmndi:BPMNEdge id="Flow_1y3v0pn_di" bpmnElement="Flow_1y3v0pn">
        <di:waypoint x="215" y="117" />
        <di:waypoint x="270" y="117" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0snq7p2_di" bpmnElement="Flow_0snq7p2">
        <di:waypoint x="370" y="117" />
        <di:waypoint x="432" y="117" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="179" y="99" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="191" y="142" width="13" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0cphl9j_di" bpmnElement="Activity_0fto51j">
        <dc:Bounds x="270" y="77" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1hro3k1_di" bpmnElement="Event_1hro3k1">
        <dc:Bounds x="432" y="99" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="444" y="142" width="13" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;


export const paymentBpmn = `<?xml version="1.0" encoding="UTF-8"?><definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:signavio="http://www.signavio.com" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" exporter="Signavio Process Editor, http://www.signavio.com" exporterVersion="14.7.1" expressionLanguage="http://www.w3.org/TR/XPath" id="sid-fbca55fc-24da-429a-8405-6152632db3bd" targetNamespace="http://www.signavio.com" typeLanguage="http://www.w3.org/2001/XMLSchema" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL http://www.omg.org/spec/BPMN/2.0/20100501/BPMN20.xsd">
<collaboration id="sid-cc896b7a-526b-4d4c-a82a-f34c664fb501">
   <extensionElements>
	  <signavio:signavioDiagramMetaData metaKey="prozessreifegrad" metaValue=""/>
	  <signavio:signavioDiagramMetaData metaKey="iso9000ff" metaValue=""/>
	  <signavio:signavioDiagramMetaData metaKey="processgoal" metaValue=""/>
	  <signavio:signavioDiagramMetaData metaKey="meta-processowner" metaValue=""/>
	  <signavio:signavioDiagramMetaData metaKey="revisionid" metaValue="b5b5b88a078c44ee8f6f63bf8fa929b7"/>
   </extensionElements>
   <participant id="sid-508811D0-6F29-4C25-A9CB-2C5836CB3CC8" name="InsureIT" processRef="sid-42EDCB37-4E86-4CFF-B009-61BA6D786C69">
	  <extensionElements>
		 <signavio:signavioMetaData metaKey="bgcolor" metaValue="#ffffff"/>
		 <signavio:signavioMetaData metaKey="bordercolor" metaValue="#000000"/>
	  </extensionElements>
   </participant>
</collaboration>
<process id="sid-42EDCB37-4E86-4CFF-B009-61BA6D786C69" isClosed="false" isExecutable="false" name="InsureIT" processType="None">
   <extensionElements/>
   <laneSet id="sid-1baa6a03-9176-4b4b-a811-52b08241c567">
	  <lane id="sid-AB55827B-482A-4535-BE40-88AFE32BAA85" name="Finance Officer">
		 <extensionElements>
			<signavio:signavioMetaData metaKey="bgcolor" metaValue=""/>
			<signavio:signavioMetaData metaKey="bordercolor" metaValue="#000000"/>
		 </extensionElements>
		 <flowNodeRef>sid-37578613-E27C-44F4-AA23-EE2047F2B460</flowNodeRef>
		 <flowNodeRef>sid-9B04BE1D-D7CC-4958-A6B1-ED20A39820F2</flowNodeRef>
		 <flowNodeRef>sid-DAC254B2-05AF-46A7-9184-10633905777E</flowNodeRef>
	  </lane>
   </laneSet>
   <startEvent id="sid-37578613-E27C-44F4-AA23-EE2047F2B460" name="Entitlement approved">
	  <extensionElements>
		 <signavio:signavioMetaData metaKey="bgcolor" metaValue="#ffffff"/>
		 <signavio:signavioMetaData metaKey="bordercolor" metaValue="#000000"/>
		 <signavio:signavioMetaData metaKey="vorgngerprozesse" metaValue=""/>
	  </extensionElements>
	  <outgoing>sid-56EE56C3-EB17-4C07-AC25-E5429E94404B</outgoing>
   </startEvent>
   <task completionQuantity="1" id="sid-9B04BE1D-D7CC-4958-A6B1-ED20A39820F2" isForCompensation="false" name="Make payment" startQuantity="1">
	  <extensionElements>
		 <signavio:signavioMetaData metaKey="bgcolor" metaValue="#ffffcc"/>
		 <signavio:signavioMetaData metaKey="bordercolor" metaValue="#000000"/>
		 <signavio:signavioMetaData metaKey="erteiltfreigabe" metaValue=""/>
		 <signavio:signavioMetaData metaKey="meta-risks" metaValue=""/>
		 <signavio:signavioMetaData metaKey="wirdkonsultiert" metaValue=""/>
		 <signavio:signavioMetaData metaKey="externaldocuments" metaValue=""/>
		 <signavio:signavioMetaData metaKey="wirdinformiert" metaValue=""/>
	  </extensionElements>
	  <incoming>sid-56EE56C3-EB17-4C07-AC25-E5429E94404B</incoming>
	  <outgoing>sid-DF92D732-581A-4FEB-A834-D9EC2337F1FD</outgoing>
   </task>
   <endEvent id="sid-DAC254B2-05AF-46A7-9184-10633905777E" name="Payment set up">
	  <extensionElements>
		 <signavio:signavioMetaData metaKey="bgcolor" metaValue="#ffffff"/>
		 <signavio:signavioMetaData metaKey="bordercolor" metaValue="#000000"/>
		 <signavio:signavioMetaData metaKey="nachfolgerprozesse" metaValue=""/>
	  </extensionElements>
	  <incoming>sid-DF92D732-581A-4FEB-A834-D9EC2337F1FD</incoming>
   </endEvent>
   <sequenceFlow id="sid-56EE56C3-EB17-4C07-AC25-E5429E94404B" name="" sourceRef="sid-37578613-E27C-44F4-AA23-EE2047F2B460" targetRef="sid-9B04BE1D-D7CC-4958-A6B1-ED20A39820F2">
	  <extensionElements>
		 <signavio:signavioMetaData metaKey="bordercolor" metaValue="#000000"/>
	  </extensionElements>
   </sequenceFlow>
   <sequenceFlow id="sid-DF92D732-581A-4FEB-A834-D9EC2337F1FD" name="" sourceRef="sid-9B04BE1D-D7CC-4958-A6B1-ED20A39820F2" targetRef="sid-DAC254B2-05AF-46A7-9184-10633905777E">
	  <extensionElements>
		 <signavio:signavioMetaData metaKey="bordercolor" metaValue="#000000"/>
	  </extensionElements>
   </sequenceFlow>
   <association associationDirection="None" id="sid-CF386715-2432-4D73-95B4-C17BE165FA3E" sourceRef="sid-9B04BE1D-D7CC-4958-A6B1-ED20A39820F2" targetRef="sid-2B19EB61-1349-401C-BBAD-FF628D20343B">
	  <extensionElements>
		 <signavio:signavioMetaData metaKey="bordercolor" metaValue="#000000"/>
	  </extensionElements>
   </association>
   <textAnnotation id="sid-2B19EB61-1349-401C-BBAD-FF628D20343B" signavio:alignment="left" textFormat="text/plain">
	  <extensionElements>
		 <signavio:signavioMetaData metaKey="bordercolor" metaValue="#000000"/>
	  </extensionElements>
	  <text>Trigger first payment manually and schedule the monthly entitlement for subsequent months</text>
   </textAnnotation>
</process>
<bpmndi:BPMNDiagram id="sid-69379f69-41b2-4358-89f4-fdacbfc286c6">
   <bpmndi:BPMNPlane bpmnElement="sid-cc896b7a-526b-4d4c-a82a-f34c664fb501" id="sid-caadff68-2944-419d-93b6-0930f4dec8af">
	  <bpmndi:BPMNShape bpmnElement="sid-508811D0-6F29-4C25-A9CB-2C5836CB3CC8" id="sid-508811D0-6F29-4C25-A9CB-2C5836CB3CC8_gui" isHorizontal="true">
		 <omgdc:Bounds height="328.0" width="971.0" x="210.0" y="210.0"/>
		 <bpmndi:BPMNLabel labelStyle="sid-06b1397c-e3bf-4e4b-87fa-bda113c933bb">
			<omgdc:Bounds height="45.514286041259766" width="12.0" x="215.0" y="351.2428569793701"/>
		 </bpmndi:BPMNLabel>
	  </bpmndi:BPMNShape>
	  <bpmndi:BPMNShape bpmnElement="sid-AB55827B-482A-4535-BE40-88AFE32BAA85" id="sid-AB55827B-482A-4535-BE40-88AFE32BAA85_gui" isHorizontal="true">
		 <omgdc:Bounds height="328.0" width="941.0" x="240.0" y="210.0"/>
		 <bpmndi:BPMNLabel labelStyle="sid-06b1397c-e3bf-4e4b-87fa-bda113c933bb">
			<omgdc:Bounds height="78.68571472167969" width="12.0" x="246.0" y="334.65714263916016"/>
		 </bpmndi:BPMNLabel>
	  </bpmndi:BPMNShape>
	  <bpmndi:BPMNShape bpmnElement="sid-37578613-E27C-44F4-AA23-EE2047F2B460" id="sid-37578613-E27C-44F4-AA23-EE2047F2B460_gui">
		 <omgdc:Bounds height="30.0" width="30.0" x="375.0" y="359.0"/>
		 <bpmndi:BPMNLabel labelStyle="sid-d9dd7f3f-5741-4c60-998c-4eeb4932ab20">
			<omgdc:Bounds height="11.0" width="106.77857208251953" x="336.61071395874023" y="391.0"/>
		 </bpmndi:BPMNLabel>
	  </bpmndi:BPMNShape>
	  <bpmndi:BPMNShape bpmnElement="sid-9B04BE1D-D7CC-4958-A6B1-ED20A39820F2" id="sid-9B04BE1D-D7CC-4958-A6B1-ED20A39820F2_gui">
		 <omgdc:Bounds height="80.0" width="100.0" x="555.0" y="334.0"/>
		 <bpmndi:BPMNLabel labelStyle="sid-06b1397c-e3bf-4e4b-87fa-bda113c933bb">
			<omgdc:Bounds height="12.0" width="77.9142837524414" x="566.0428581237793" y="366.0"/>
		 </bpmndi:BPMNLabel>
	  </bpmndi:BPMNShape>
	  <bpmndi:BPMNShape bpmnElement="sid-DAC254B2-05AF-46A7-9184-10633905777E" id="sid-DAC254B2-05AF-46A7-9184-10633905777E_gui">
		 <omgdc:Bounds height="28.0" width="28.0" x="700.0" y="360.0"/>
		 <bpmndi:BPMNLabel labelStyle="sid-d9dd7f3f-5741-4c60-998c-4eeb4932ab20">
			<omgdc:Bounds height="11.0" width="77.78571319580078" x="675.1071434020996" y="390.0"/>
		 </bpmndi:BPMNLabel>
	  </bpmndi:BPMNShape>
	  <bpmndi:BPMNShape bpmnElement="sid-2B19EB61-1349-401C-BBAD-FF628D20343B" id="sid-2B19EB61-1349-401C-BBAD-FF628D20343B_gui">
		 <omgdc:Bounds height="74.0" width="130.0" x="700.0" y="231.0"/>
	  </bpmndi:BPMNShape>
	  <bpmndi:BPMNEdge bpmnElement="sid-56EE56C3-EB17-4C07-AC25-E5429E94404B" id="sid-56EE56C3-EB17-4C07-AC25-E5429E94404B_gui">
		 <omgdi:waypoint x="405.0" y="374.0"/>
		 <omgdi:waypoint x="555.0" y="374.0"/>
	  </bpmndi:BPMNEdge>
	  <bpmndi:BPMNEdge bpmnElement="sid-CF386715-2432-4D73-95B4-C17BE165FA3E" id="sid-CF386715-2432-4D73-95B4-C17BE165FA3E_gui">
		 <omgdi:waypoint x="640.8392259024935" y="334.0"/>
		 <omgdi:waypoint x="700.0" y="267.9709241952232"/>
	  </bpmndi:BPMNEdge>
	  <bpmndi:BPMNEdge bpmnElement="sid-DF92D732-581A-4FEB-A834-D9EC2337F1FD" id="sid-DF92D732-581A-4FEB-A834-D9EC2337F1FD_gui">
		 <omgdi:waypoint x="655.0" y="374.0"/>
		 <omgdi:waypoint x="700.0" y="374.0"/>
	  </bpmndi:BPMNEdge>
   </bpmndi:BPMNPlane>
   <bpmndi:BPMNLabelStyle id="sid-d9dd7f3f-5741-4c60-998c-4eeb4932ab20">
	  <omgdc:Font isBold="false" isItalic="false" isStrikeThrough="false" isUnderline="false" name="Arial" size="11.0"/>
   </bpmndi:BPMNLabelStyle>
   <bpmndi:BPMNLabelStyle id="sid-06b1397c-e3bf-4e4b-87fa-bda113c933bb">
	  <omgdc:Font isBold="false" isItalic="false" isStrikeThrough="false" isUnderline="false" name="Arial" size="12.0"/>
   </bpmndi:BPMNLabelStyle>
</bpmndi:BPMNDiagram>
</definitions>`;