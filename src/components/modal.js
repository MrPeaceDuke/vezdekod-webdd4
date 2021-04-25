import React from "react";
import { IoMdClose } from "react-icons/io"
import $ from "jquery";
const status = ["Новое", "В обработке", "Завершено"];//0 1 2 3

class ModalFrame extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			textarea: ""
		}
	}
	render() {
		return (
			<div className="position-absolute flex-column align-items-center justify-content-center" style={{
				display: this.props.opened ? "flex" : "none",
				height: "100%",
				width: "100%",
				backgroundColor: "#00000055",
				zIndex: "5000"

			}}>
				<div className="d-flex flex-row" style={{
					borderRadius: "5px",
					maxHeight: "100%",
					boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.7)"
				}}>
					<div className="d-flex flex-column bg-light" style={{
						width: "30vw",
						borderRadius: "5px",

					}}>
						<div className="d-flex flex-row align-items-center" style={{
							padding: "0.5vw 1vw",
							borderBottom: "1px solid #0000002e"
						}}>
							<span>Обращение №{this.props.modalId}</span>
							<IoMdClose className="closeBtn ms-auto" onClick={() => this.props.closeFrame(-1)} />
						</div>
						<div className="d-flex flex-row" style={{
							padding: "0.5vw 1vw",
							borderBottom: "1px solid #0000002e"
						}}>
							<div className="d-flex flex-column w-100">
								<div className="d-flex flex-row">
									<div className="d-flex flex-column w-100">
										<label class="form-label mb-0">Дата создания обращения:</label>
										<input type="text" class="form-control" value={this.props.dateCreation} disabled />
									</div>
								</div>
								{
									this.props.status === 2 && (
										<div className="d-flex flex-row">
											<div className="d-flex flex-column w-100">
												<label class="form-label mb-0">Дата закрытия обращения:</label>
												<input type="text" class="form-control" value={this.props.dateClosed} disabled />
											</div>
										</div>
									)
								}
								<div className="d-flex flex-row mt-3">
									<div className="d-flex flex-column w-100">
										<label class="form-label mb-0">Фамилия Имя Отчество:</label>
										<input type="text" class="form-control" value={this.props.name} disabled />
									</div>
								</div>
								<div className="d-flex flex-row mt-3">
									<div className="d-flex flex-column w-100">
										<label class="form-label mb-0">Номер телефона:</label>
										<input type="text" class="form-control" value={this.props.phone} disabled />
									</div>
								</div>
								<div className="d-flex flex-row mt-3">
									<div className="d-flex flex-column w-100">
										<label class="form-label mb-0">Статус:</label>
										<input type="text" class="form-control" value={status[this.props.status]} disabled />
									</div>
								</div>
								<div className="d-flex flex-row mt-3 mb-2">
									<div className="d-flex flex-column w-100">
										<label class="form-label mb-0">Обращение:</label>
										<textarea type="text" class="form-control" value={this.props.text} disabled style={{
											resize: "none"
										}} />
									</div>
								</div>

								<div className="d-flex flex-row mt-3">
									<div className="d-flex flex-column w-100">
										<label class="form-label mb-0">Комментарий:</label>
										{
											this.props.status === 0 ? (
												<textarea type="text" id="comment" class="form-control" placeholder="Укажите здесь комментарий к обращению..." rows="5" onInput={(e) => {
													this.setState({
														textarea: $("#comment").val()
													})
												}} style={{
													maxHeight: "15vw",
													minHeight: "3vw"
												}} />
											) : (
													<textarea type="text" id="comment" class="form-control" placeholder="" defaultValue={this.props.comment} disabled rows="5" style={{
														maxHeight: "15vw",
														minHeight: "3vw"
													}} />
													
												)
										}
									</div>
								</div>
							</div>
						</div>
						{
							this.props.status === 0 && (
								<div className="d-flex flex-row" style={{
									padding: "0.5vw 1vw"
								}}>
									<button type="button" class="btn btn-success ms-auto" onClick={() => this.props.finishRequest(this.props.modalId, this.state.textarea)}>Завершить обращение</button>
								</div>
							)
						}

					</div>

				</div>
			</div>

		)
	}
}
export default ModalFrame;